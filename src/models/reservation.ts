import mongoose, { Schema, Document } from 'mongoose';

interface Header {
  modifier: string;
  name: string;
  type: string;
}

interface Col {
  header: Header;
  value: string | number | boolean | null;
}

interface Row {
  cols: Col[];
}

interface ReservationData {
  headers: Header[];
  rows: Row[];
}

export interface IReservation extends Document {
  config: {
    description: string | null;
    name: string;
    period: string;
    ui_type: string;
  };
  data: ReservationData;
}

const ReservationSchema: Schema = new Schema(
  {
    dayOfYear: { type: Number, required: true, unique: true },
    config: {
      description: { type: String, default: null },
      name: { type: String, required: true },
      period: { type: String, required: true },
      ui_type: { type: String, required: true },
    },
    data: {
      headers: [
        {
          modifier: { type: String, required: true },
          name: { type: String, required: true },
          type: { type: String, required: true },
        },
      ],
      rows: [
        {
          cols: [
            {
              header: {
                modifier: { type: String, required: true },
                name: { type: String, required: true },
                type: { type: String, required: true },
              },
              value: { type: Schema.Types.Mixed },
            },
          ],
        },
      ],
    },
  },
  { timestamps: true }
);

export const Reservation = mongoose.model<IReservation>(
  'Reservation',
  ReservationSchema
);
