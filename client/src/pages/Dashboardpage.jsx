import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link
import axios from '../api/axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Sidebar from '../components/sidebar';
import Header from '../components/Header';
import Chart from '../components/chart';
import ThreeDChart from '../components/ThreeDChart';

const DashboardPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [chartType, setChartType] = useState('2D');
  const [analysisName, setAnalysisName] = useState('');
  
  const { fileId } = useParams();
  const chartRef = useRef(null);
  useEffect(() => {
    const fetchFileForAnalysis = async () => {
      if (fileId) {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const token = userInfo ? userInfo.token : null;
          if (!token) { setError('You must be logged in.'); return; }

          const { data: fileData } = await axios.get(`/api/files/${fileId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUploadedFile(fileData);
          setHeaders(fileData.headers);
          if (fileData.headers.length >= 2) {
            setXAxis(fileData.headers[0]);
            setYAxis(fileData.headers[1]);
          }
        } catch (err) {
          setError('Failed to load the selected file.');
        }
      }
    };
    fetchFileForAnalysis();
  }, [fileId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setUploadedFile(null); 
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : null;
    if (!token) { setError('You must be logged in.'); return; }
    const formData = new FormData();
    formData.append('excelFile', file);
    setUploading(true);
    setError('');
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`} };
      const { data: uploadData } = await axios.post('/api/files/upload', formData, config);
      alert('File uploaded successfully!');
      const { data: fileData } = await axios.get(`/api/files/${uploadData.fileId}`, { headers: { Authorization: `Bearer ${token}` } });
      setUploadedFile(fileData);
      setHeaders(fileData.headers);
      if (fileData.headers.length >= 2) {
        setXAxis(fileData.headers[0]);
        setYAxis(fileData.headers[1]);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error processing file.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisName) { alert('Please provide a name for your analysis.'); return; }
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;
    if (!token) return;
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.post(`/api/files/${uploadedFile._id}/analysis`, 
            { name: analysisName, chartType, xAxis, yAxis }, 
            config
        );
        alert(`Analysis "${analysisName}" saved successfully!`);
        setAnalysisName('');
    } catch (error) {
        alert('Failed to save analysis.');
    }
  };
  
  const handleDownload = (format) => {
    const chartElement = chartRef.current;
    if (!chartElement) return;
    html2canvas(chartElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      if (format === 'png') {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `${uploadedFile.fileName}-chart.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
        pdf.save(`${uploadedFile.fileName}-chart.pdf`);
      }
    });
  };

  return (
    <div className="flex h-screen bg-base-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-text-primary">Upload and Analyze Your Excel File</h1>
            {!fileId && !uploadedFile && (
                <div className="mt-6 p-6 bg-content-bg rounded-xl shadow-md">
                   <h2 className="text-xl font-semibold mb-4 text-text-primary">Upload New File</h2>
                  <div className="flex items-center space-x-4">
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary hover:file:bg-blue-100 disabled:opacity-50 transition" disabled={uploading}/>
                    <button onClick={handleUpload} disabled={uploading || !file} className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-hover disabled:bg-blue-300 transition duration-150">
                      {uploading ? 'Processing...' : 'Upload'}
                    </button>
                  </div>
                </div>
            )}
            
            {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md mt-4">{error}</p>}

            {uploadedFile ? (
              <div className="mt-8 p-6 bg-content-bg rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold text-text-primary">Chart Visualization for: {uploadedFile.fileName}</h2>
                        <p className="text-text-secondary mb-4">Select columns for the X and Y axes to generate a chart.</p>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setChartType('2D')} className={`px-4 py-2 text-sm font-medium rounded-md ${chartType === '2D' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>2D</button>
                        <button onClick={() => setChartType('3D')} className={`px-4 py-2 text-sm font-medium rounded-md ${chartType === '3D' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>3D</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="x-axis" className="block text-sm font-medium text-text-primary">X-Axis</label>
                    <select id="x-axis" value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                      {headers.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="y-axis" className="block text-sm font-medium text-text-primary">Y-Axis</label>
                    <select id="y-axis" value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                      {headers.map(header => <option key={header} value={header}>{header}</option>)}
                    </select>
                  </div>
                </div>
                <div ref={chartRef} className="w-full h-96 border rounded-lg p-4">
                   {uploadedFile.data && chartType === '2D' ? (
                     <Chart chartData={uploadedFile.data} xAxisLabel={xAxis} yAxisLabel={yAxis} />
                   ) : uploadedFile.data && chartType === '3D' ? (
                     <ThreeDChart chartData={uploadedFile.data} xAxisLabel={xAxis} yAxisLabel={yAxis} />
                   ) : null}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                      <input type="text" placeholder="Name this analysis (e.g., Q3 Sales)" value={analysisName} onChange={(e) => setAnalysisName(e.target.value)} className="px-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-primary focus:border-primary"/>
                      <button onClick={handleSaveAnalysis} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Save Analysis</button>
                  </div>
                  <div className="flex space-x-3">
                    <button onClick={() => handleDownload('png')} className="px-4 py-2 text-sm font-medium text-primary bg-blue-100 rounded-md hover:bg-blue-200">Download as PNG</button>
                    <button onClick={() => handleDownload('pdf')} className="px-4 py-2 text-sm font-medium text-primary bg-blue-100 rounded-md hover:bg-blue-200">Download as PDF</button>
                  </div>
                </div>
              </div>
            ) : (
                // This message shows when no file is loaded
                <div className="text-center text-gray-500 mt-10">
                    <p>No file selected for analysis.</p>
                    <p>Please upload a new file above, or select one from your <Link to="/history" className="text-primary hover:underline">Upload History</Link>.</p>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;