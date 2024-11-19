// routes/reservations.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import { getDayOfYear } from '../../utils/dates';

const router = Router();

router.get('/fetch-daily-reservations', async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const dayofyear = getDayOfYear(today);

    const payload = {
      struct_binds: JSON.stringify({ year, dayofyear }),
    };

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

    // Print reservations to the console
    console.log(reservations);

    res.json({ message: 'Reservations fetched successfully', reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
