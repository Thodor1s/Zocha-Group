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

const fetchAndUpdateReservations = async () => {
  try {
    await axios.get('http://localhost:3000/update-reservations');
    console.log('Reservations fetched and updated');
  } catch (error) {
    console.error('Error fetching reservations:', error);
  }
};

/* * * * * 
  THis is a cronjob that triggers the fetching of the data every minute.
  By dynamically changing the time between triggers, we could utilize 
  adaptive polling to potentially reduce the number of calls to the RESY 
  backend. We could for example increase the time between polling
  if there are no changes, poll only at certain hours of the day,
  or poll at random.

  Since our very own frontend doesn't need to poll the RESY api, but gets
  the data from Mongo, we can use any or all adaptive polling strategies, 
  For a live restaurant reservation system like what I figured you had in
  mind, polling more when the restaurant is open, or when reservations are
  more likely to come in (by utilizing some business logic I am not aware of)
  is a valid strategy.
* * * * */

cron.schedule('* * * * *', fetchAndUpdateReservations);

// Fetch and update reservations immediately upon server start
fetchAndUpdateReservations();

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
