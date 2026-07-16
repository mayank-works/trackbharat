// src/services/api.ts
export interface Train {
  id: string;
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  status: 'On Time' | 'Delayed' | 'Arrived';
  progress: number; // 0 to 100
  routeStations: string[];
}

// Mock data for now (we swap to real FastAPI later)
export const MOCK_TRAINS: Train[] = [
  {
    id: '1',
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '16:55',
    arrival: '08:35',
    status: 'On Time',
    progress: 65,
    routeStations: ['New Delhi', 'Kota', 'Vadodara', 'Mumbai Central'],
  },
  {
    id: '2',
    number: '12002',
    name: 'Bhopal Shatabdi',
    from: 'New Delhi',
    to: 'Habibganj',
    departure: '14:30',
    arrival: '21:30',
    status: 'Delayed',
    progress: 20,
    routeStations: ['New Delhi', 'Agra', 'Gwalior', 'Habibganj'],
  },
];

export const trainAPI = {
  search: (query: string): Promise<Train[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query.trim()) resolve(MOCK_TRAINS);
        else {
          resolve(MOCK_TRAINS.filter(t => 
            t.number.includes(query) || 
            t.name.toLowerCase().includes(query.toLowerCase())
          ));
        }
      }, 500);
    });
  },
  getById: (id: string): Promise<Train | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TRAINS.find(t => t.id === id)), 300);
    });
  }
};