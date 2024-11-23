import { Router, Request, Response } from 'express';
import axios from 'axios';
import { getDayOfYear } from '../../utils/dates';
import { Reservation } from '../../models/reservation';
import { log, success, failure } from '../../utils/log';

const router = Router();

router.get('/update-reservations', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const dayOfYear = getDayOfYear(today);
    const payload = {
      struct_binds: JSON.stringify({ year, dayofyear: dayOfYear }),
    };
    /* * * * * 
      Reversed Engineered from the /reservation call of the RESY OS api as required.
      I monitored the traffic of RESY OS and there's not an obvious way to me other than adaptive 
      polling (see src/index.ts) to reduce calls from this API to RESY. I didn't see any websockets
      or server-side events. Only datadog traffic. And the's also "Refresh Data" link as well so
      I'm not sure it's designed like that. 
      
      This is where this solution comes in! 
    * * * * */
    const response = await axios.post(
      'https://api.resy.com/3/analytics/report/core/Reservations',
      payload,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `ResyAPI api_key="${process.env.RESY_API_KEY}"`,
          'x-resy-services-auth': process.env.RESY_SERVICES_AUTH,
        },
      }
    );
    /* * * * * 
      It's possible to optimize the trigger to only force a frontend update when something 
      changes, and not force updates to the frontend when there are no updates to the Database, 
      but since we can't manipulate the original data, this better demonstrates that this 
      integration is in fact LIVE!

      This could happen by comparing polled reservations with what's already in the database:
        { const currentReservations = await Reservation.findOne({ dayOfYear }); }
      and only triggering:
        {
          const io = req.app.get('socketio');
          io.emit('reservationUpdate', upsertedReservation);
        }
      conditionally
    * * * * */
    const newReservations = response.data;
    const upsertedReservation = await Reservation.findOneAndUpdate(
      { dayOfYear },
      { data: newReservations[0].data, dayOfYear },
      { upsert: true, new: true }
    );

    const io = req.app.get('socketio');
    io.emit('reservationUpdate', upsertedReservation);
    log(
      'GET /update-reservations',
      success,
      '',
      `Fetched for day of year: ${dayOfYear}`
    );
    res.json({
      message: 'Reservation fetched and upserted successfully',
      reservation: upsertedReservation,
    });
  } catch (error) {
    log('GET /update-reservations', failure, error, '');
    res.status(500).json({ error: 'Internal Server Error [500]' });
  }
});

router.get('/reservations', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const reservation = await Reservation.findOne({ dayOfYear });
    log(
      'GET /reservations',
      success,
      '',
      `Sent to Frontend for day of year: ${dayOfYear}`
    );
    res.json(reservation);
  } catch (error) {
    log('GET /reservations', failure, error, '');
    res.status(500).json({ error: 'Internal Server Error [500]' });
  }
});

export default router;
