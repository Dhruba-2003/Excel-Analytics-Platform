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


const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://excel-sathi.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(express.json());

const getMongoHost = (uri) => {
  if (!uri) return 'MONGO_URI not set';
  try {
    const m = uri.match(/@([^/]+)/);
    if (m && m[1]) return m[1];
    const m2 = uri.match(/\/\/([^/]+)/);
    return m2 && m2[1] ? m2[1] : 'unknown-host';
  } catch (e) {
    return 'parse-error';
  }
};

console.log('Using MONGO_URI host:', getMongoHost(process.env.MONGO_URI));

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