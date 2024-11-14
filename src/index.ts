import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import { db } from './utils/db';
import ReservationRouter from './routes/reservations'

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', ReservationRouter);

// Error handling
app.use((req: Request, res: Response, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Check DB connection and sync models
db.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    return db.sync(); // Sync models with the database
  })
  .then(() => {
    console.log('SQL connected and models synced');
  })
  .catch((error: any) => {
    console.error('Error connecting to the database:', error);
  });

// Cron job to fetch reservations every minute
cron.schedule('* * * * *', async () => {
  try {
    await axios.get('http://localhost:3000/fetch-reservations');
    console.log('Reservations fetched and updated');
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});