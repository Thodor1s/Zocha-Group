import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import { connectDB } from './utils/db';
import ReservationRouter from './routes/reservations';
import { getDayOfYear } from './utils/dates'; // Import the utility function

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', ReservationRouter);

// Error handling for 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

// General error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

connectDB();

cron.schedule('* * * * *', async () => {
  const today = new Date();
  //const currentDayOfYear = getDayOfYear(today);
  try {
    await axios.get('http://localhost:3000/fetch-daily-reservations');
    console.log('Reservations fetched and updated');
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
