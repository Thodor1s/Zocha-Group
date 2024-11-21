import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import { connectDB } from './utils/db';
import ReservationRouter from './routes/reservations';
import { Server } from 'socket.io';

dotenv.config();
const app: Application = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.use(cors());
app.use(express.json());
app.use('/', ReservationRouter);

//404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

//500
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connection to the Database
connectDB();

// Cron job for reservation updating
cron.schedule('* * * * *', async () => {
  try {
    await axios.get('http://localhost:3000/update-reservations');
    console.log('Reservations fetched and updated');
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
});

//Socket for frontend to get updates
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('socketio', io);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
