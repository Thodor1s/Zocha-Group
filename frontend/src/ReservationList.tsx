import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MdPerson, MdTableBar } from 'react-icons/md';
import { Header, Row, ApiResponse } from './Reservations';

const socket = io('http://localhost:3000');
const reservationsURL = 'http://localhost:3000/reservations';

const ReservationList: React.FC = () => {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchReservations = async (updating: boolean) => {
    setLoading(true);
    try {
      const response = await fetch(reservationsURL);
      const reservations: ApiResponse = await response.json();
      setHeaders(reservations.data.headers);
      setRows(reservations.data.rows);
      setLastUpdated(new Date());
      /* * * * * 
        The timeout is here to better demonstrate that this integration is in fact LIVE! 
      * * * * */
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    socket.on('reservationUpdate', () => fetchReservations(true));
    fetchReservations(false);
    return () => {
      socket.off('reservationUpdate', fetchReservations);
    };
  }, []);

  const getFieldIndex = (fieldName: string): number => {
    return headers.findIndex((header) => header.name === fieldName);
  };

  const guestIndex = getFieldIndex('Guest');
  const partySizeIndex = getFieldIndex('Party_Size');
  const tagsIndex = getFieldIndex('Visit_Tags');
  const dateTimeIndex = getFieldIndex('Time');
  const seatingAreaIndex = getFieldIndex('table');
  const statusIndex = getFieldIndex('status');

  const formatDate = (date: Date): string => {
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('el-GR', options).format(utcDate);
  };

  const headerImages = () => {
    const images = [
      { src: 'resy.png', alt: 'Zocha Group' },
      { src: 'zocha.png', alt: 'Zocha Group' },
      {
        src: 'live.png',
        alt: 'Zocha Group',
        title: `Tracking Live: last updated ${
          lastUpdated ? lastUpdated.toLocaleTimeString() : ''
        }`,
      },
    ];
    return images.map((image, index) => (
      <img
        key={index}
        src={image.src}
        alt={image.alt}
        className='Image'
        draggable='false'
        title={image.title || ''}
      />
    ));
  };

  return (
    <div>
      <div className='header-images'>{headerImages()}</div>
      <h2 title='Frontend and Backend based on UTC'>
        Today's Reservations{' '}
        <span style={{ fontWeight: 'normal' }}>({formatDate(new Date())})</span>
      </h2>
      {loading ? (
        <p>
          <img src='loading.gif' alt='Loading...' draggable='false' />
        </p>
      ) : (
        <>
          <table className='Table Table-bordered'>
            <thead>
              <tr>
                <th>Time</th>
                <th>Guest</th>
                <th>Tags</th>
                <th>Party Size</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>{row.cols[dateTimeIndex]?.value}</td>
                  <td>{row.cols[guestIndex]?.value}</td>
                  <td>{row.cols[tagsIndex]?.value}</td>
                  <td>
                    <MdPerson /> {row.cols[partySizeIndex]?.value}
                  </td>
                  <td>
                    <MdTableBar /> {row.cols[seatingAreaIndex]?.value}
                  </td>
                  <td>{row.cols[statusIndex]?.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ReservationList;
