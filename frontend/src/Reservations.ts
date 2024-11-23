interface Header {
  modifier: string;
  name: string;
  type: string;
  _id: string;
}

interface RowEntry {
  header: Header;
  value: any;
  _id: string;
}

interface Row {
  cols: RowEntry[];
  _id: string;
}

interface ReservationData {
  headers: Header[];
  rows: Row[];
}

interface ApiResponse {
  data: ReservationData;
}

export type { Header, RowEntry, Row, ReservationData, ApiResponse };
