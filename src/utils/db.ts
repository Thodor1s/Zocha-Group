import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { log, connection, connected, disconnected } from './log';

dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

export const connectDB = async (): Promise<void> => {
  log('Mongo DB', connection, '', '');
  try {
    await mongoose.connect(MONGO_URI, {
      // Fine-tuned options for logging
      autoIndex: false, // Avoid logging index creation in dev
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection attempt
    });
    log('Mongo DB', connected, '', '');
  } catch (error) {
    log('Mongo DB', disconnected, error, '');
    process.exit(1);
  }
};
