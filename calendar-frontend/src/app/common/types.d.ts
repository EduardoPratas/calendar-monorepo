import { Event } from 'react-big-calendar';

export interface EltEvent {
  id?: number; // Permite que `id` seja opcional
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

