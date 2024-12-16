import { ApiService } from './api.service';
import { AxiosResponse } from 'axios';
import { Moment } from 'moment';
import { ICalendarEvent } from './types';
import { EltEvent } from '../common/types';


export class CalendarService extends ApiService {
  [x: string]: any;
  async getEventsForRange(
    start: Moment,
    end: Moment,
  ): Promise<AxiosResponse<ICalendarEvent[]>> {
    return this._axios.get('/api/calendar/date-range', {
      params: { start: start.toISOString(), end: end.toISOString() },
    });
  }

  async createEvent(
    name: string,
    start: Moment,
    end: Moment,
  ): Promise<AxiosResponse<{ message: string; id: number }>> {
    return this._axios.post('/api/calendar/create-event', {
      name,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  // New method for handling event drop
  async onEventDrop(event: EltEvent, start: string | Date): Promise<void> {
    const newStartDate = typeof start === 'string' ? new Date(start) : start; // Ensure it's a Date
    try {
      await this._axios.patch(`/api/calendar/event-drop/${event.id}`, { newStart: newStartDate });
      alert('Event moved successfully');
    } catch (error) {
      console.error('Error moving event:', error);
      alert('Failed to move event');
    }
  }

  // New method for handling event resize
  async onEventResize(event: EltEvent, end: string | Date): Promise<void> {
    const newEndDate = typeof end === 'string' ? new Date(end) : end; // Ensure it's a Date
    try {
      await this._axios.patch(`/api/calendar/event-resize/${event.id}`, { newEnd: newEndDate });
      alert('Event resized successfully');
    } catch (error) {
      console.error('Error resizing event:', error);
      alert('Failed to resize event');
    }
  }
}


