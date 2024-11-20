import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      // Fine-tuned options for logging
      autoIndex: false, // Avoid logging index creation in dev
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection attempt
    });
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error); // Only log essential error info
    process.exit(1);
  }
};
