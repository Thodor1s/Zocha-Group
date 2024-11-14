import { DataTypes } from 'sequelize';
import { db } from '../utils/db';

export const Reservation = db.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guest_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  party_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
  },
  date_and_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
  seating_area: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
});