import { Router, Request, Response } from 'express';
import axios from 'axios';
import { getDayOfYear } from '../../utils/dates';
import { Reservation } from '../../models/reservation';

const router = Router();

router.get('/fetch-daily-reservations', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const dayOfYear = getDayOfYear(today);
    const payload = {
      struct_binds: JSON.stringify({ year, dayofyear: dayOfYear }),
    };
    //Reversed Engineered from the /reservation call of the RESY OS api as required
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
    const reservations = response.data;
    const upsertedReservation = await Reservation.findOneAndUpdate(
      { dayOfYear },
      { data: reservations[0].data, dayOfYear },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Reservation fetched and upserted successfully',
      reservation: upsertedReservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
