import { Router } from 'express';
import { Reservation } from '../../models/reservation';
import axios from 'axios';

const router = Router();

router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/fetch-reservations', async (req, res) => {
  try {
    const response = await axios.get('https://api.resy.com/...');
    const reservations = response.data;

    for (const reservation of reservations) {
      await Reservation.upsert({
        guest_name: reservation.guest_name,
        party_size: reservation.party_size,
        tags: reservation.tags,
        date_and_time: reservation.date_and_time,
        seating_area: reservation.seating_area,
        status: reservation.status,
      });
    }

    res.json({ message: 'Reservations updated successfully' });
  } catch (error) {
    console.log('Adding manual reservations')
    const reservations = [
      {
        guest_name: 'John Doe',
        party_size: 4,
        tags: ['family'],
        date_and_time: new Date(),
        seating_area: 1,
        status: true,
      },
      {
        guest_name: 'Jane Smith',
        party_size: 2,
        tags: ['couple'],
        date_and_time: new Date(),
        seating_area: 2,
        status: false,
      },
      {
        guest_name: 'Alice Johnson',
        party_size: 3,
        tags: ['friends'],
        date_and_time: new Date(),
        seating_area: 3,
        status: true,
      },
      {
        guest_name: 'Bob Brown',
        party_size: 5,
        tags: ['corporate'],
        date_and_time: new Date(),
        seating_area: 4,
        status: false,
      },
      {
        guest_name: 'Charlie Davis',
        party_size: 1,
        tags: ['solo'],
        date_and_time: new Date(),
        seating_area: 5,
        status: true,
      },
    ];
    for (const reservation of reservations) {
      await Reservation.upsert({
        guest_name: reservation.guest_name,
        party_size: reservation.party_size,
        tags: reservation.tags,
        date_and_time: reservation.date_and_time,
        seating_area: reservation.seating_area,
        status: reservation.status,
      });
    }
    res.json({ message: 'Reservations updated successfully' });
    //res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
