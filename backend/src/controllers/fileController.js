import multer from 'multer';
import xlsx from 'xlsx';
import File from '../models/fileModel.js';

// Configure multer to handle file uploads in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

/**
 * @desc    Handles file upload, parsing, and saving to DB
 * @route   POST /api/files/upload
 * @access  Private
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
        return res.status(400).json({ message: 'Excel file is empty or invalid.' });
    }

    const headers = Object.keys(jsonData[0]);

    const newFile = new File({
      user: req.user._id,
      fileName: req.file.originalname,
      data: jsonData,
      headers: headers
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded and parsed successfully!',
      fileId: newFile._id,
      fileName: newFile.fileName,
      headers: newFile.headers,
      data: newFile.data.slice(0, 10)
    });
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).json({ message: 'Server error during file upload.' });
  }
};

/**
 * @desc    Get file data by its ID
 * @route   GET /api/files/:id
 * @access  Private
 */
export const getFileById = async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
  
      if (file) {
        if (file.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({ message: 'User not authorized' });
        }
        res.json(file);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get all files for the logged-in user (upload history)
 * @route   GET /api/files
 * @access  Private
 */
export const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Save an analysis configuration for a file
 * @route   POST /api/files/:id/analysis
 * @access  Private
 */
export const saveAnalysis = async (req, res) => {
  const { chartType, xAxis, yAxis } = req.body;
  try {
    const file = await File.findById(req.params.id);
    if (file) {
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }
      const newAnalysis = { chartType, xAxis, yAxis };
      file.analyses.push(newAnalysis);
      await file.save();
      res.status(201).json({ message: 'Analysis saved successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
