import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import { connectDB } from './utils/db';
import ReservationRouter from './routes/reservations';
import { Server } from 'socket.io';
import {
  log,
  serverOn,
  websocketTrying,
  websocketOff,
  websocketOn,
  websocketMessage,
  notFound,
  failure,
} from './utils/log';
import WebSocket from 'ws';
import { getCurrentDateString } from './utils/dates';

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
  log('General Error!', notFound, '', '');
  res.status(404).json({ error: 'Not Found [404]' });
});

//500
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  log('General Error!', failure, '', '');
  res.status(500).json({ error: 'Internal Server Error [500]' });
});

connectDB();

const fetchAndUpdateReservations = async () => {
  try {
    await axios.get('http://localhost:3000/update-reservations');
  } catch (error) {}
};

let ws: WebSocket;

const initializeWebSocket = () => {
  const dateString = getCurrentDateString();
  /* * * * * 
      Reversed Engineered from the IOS app.
  * * * * */
  const wsUrl = `wss://ws-us2.pusher.com/app/700fac7baa551e880dee?client=pusher-websocket-swift&version=10.1.5&protocol=7`;

  ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    log('Subscribing to Resy venue-81702...', websocketTrying, '', '');
    const subscribeMessage = {
      event: 'pusher:subscribe',
      data: {
        channel: `venue-82702-${dateString}`,
      },
    };
    ws.send(JSON.stringify(subscribeMessage));
  });

  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    if (message.event === 'pusher:connection_established') {
      log('Subscribed to venue-81702', websocketOn, message.event, '');
    } else {
      log(
        'New data for venue-81702! Updating reservations...',
        websocketMessage,
        message.event,
        ''
      );
      fetchAndUpdateReservations();
    }
  });

  ws.on('close', () => {
    console.log('close');
    log('No longer subscribed to venue-81702.', websocketOff, '', '');
  });

  ws.on('error', (error) => {
    console.log('error');
    log('Websocket error occurred.', failure, error, '');
  });
};

const monitorDateChange = () => {
  let currentDateString = getCurrentDateString();

  setInterval(() => {
    const newDateString = getCurrentDateString();
    if (newDateString !== currentDateString) {
      currentDateString = newDateString;
      if (ws) {
        ws.close();
      }
      initializeWebSocket();
    }
  }, 60000);
};

initializeWebSocket();
monitorDateChange();

io.on('connection', (socket) => {
  log('A frontend connected!', websocketOn, '', '');
  socket.on('disconnect', () => {
    log('A frontend disconnected!', websocketOff, '', '');
  });
});

app.set('socketio', io);

server.listen(port, () => {
  log('', serverOn, '', `on port ${port}`);
});
