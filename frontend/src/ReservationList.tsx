import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    socket.on('reservationUpdate', (data) => {
      setReservations(data);
    });

    // Fetch initial data
    fetch('http://localhost:3000/update-reservations')
      .then((response) => response.json())
      .then((data) => {
        console.log(data.reservation.data.headers);
        console.log(data.reservation.data.rows);

        setReservations(data.reservation.data);
      });
    return () => {
      socket.off('reservationUpdate');
    };
  }, []);

  return (
    <div>
      <h1>Daily Reservations</h1>
      {/*
      <ul>
        {reservations.map((reservation, index) => {
          
          return <li key={index}>The Reservations</li>;
        })}
      </ul>
      */}
    </div>
  );
};

export default ReservationList;
