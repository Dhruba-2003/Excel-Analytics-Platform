import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

// --- CORS Configuration ---
// This is the fix. It tells the server to allow requests
// specifically from your live frontend URL.
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://excel-sathi.netlify.app',
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));


app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});