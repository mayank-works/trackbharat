export interface RouteStation {
  station: string;
  code: string;
  arrival: string;
  departure: string;
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
}

export interface TrainLiveData {
  train_number: string;
  train_name: string;
  current_station: string;
  current_status: string;
  delay_minutes: number;
  next_station: string;
  eta_next: string;
  platform: string;
  speed: number;
  route: RouteStation[];
}

export interface LiveUpdateMessage {
  type: 'live_update' | 'error';
  train_number: string;
  data?: TrainLiveData;
  message?: string;
  timestamp: string;
}