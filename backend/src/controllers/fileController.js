import multer from 'multer';
import xlsx from 'xlsx';
import File from '../models/fileModel.js';
import User from '../models/userModel.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) { return res.status(400).json({ message: 'No file uploaded.' }); }
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    if (jsonData.length === 0) { return res.status(400).json({ message: 'Excel file is empty.' }); }
    const headers = Object.keys(jsonData[0]);
    const newFile = new File({
      user: req.user._id,
      fileName: req.file.originalname,
      data: jsonData,
      headers: headers
    });
    await newFile.save();
    res.status(201).json({
      message: 'File uploaded successfully!',
      fileId: newFile._id,
      fileName: newFile.fileName,
      headers: newFile.headers,
      data: newFile.data.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during file upload.' });
  }
};

export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (file) {
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      res.json(file);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// This function now handles saving named analyses
export const saveAnalysis = async (req, res) => {
  const { name, chartType, xAxis, yAxis } = req.body;
  if (!name) {
      return res.status(400).json({ message: 'Analysis name is required.' });
  }
  try {
    const file = await File.findById(req.params.id);
    if (file) {
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const newAnalysis = { name, chartType, xAxis, yAxis };
      file.savedAnalyses.push(newAnalysis);
      await file.save();
      res.status(201).json({ message: 'Analysis saved successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// This function now also handles searching based on a keyword
export const getUserFiles = async (req, res) => {
    const keyword = req.query.search ? {
        fileName: {
            $regex: req.query.search,
            $options: 'i' // case-insensitive search
        }
    } : {};

  try {
    const files = await File.find({ user: req.user._id, ...keyword }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};