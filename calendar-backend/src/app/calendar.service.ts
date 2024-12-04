import { BadRequestException, Injectable } from '@nestjs/common';
import { CalendarEventRepository } from '@fs-tech-test/calendar-domain';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarEventRepository: CalendarEventRepository,
  ) {}

  async getEvents(start: string, end: string) {
    if (!start || !end) throw new BadRequestException('No start/end specified');

    return this.calendarEventRepository.findForRange(
      new Date(start),
      new Date(end),
    );
  }

  async addEvent(payload: EventPayload) {
    const newEntity = await this.calendarEventRepository.createNewEvent(
      payload.name,
      new Date(payload.start),
      new Date(payload.end),
    );

    return newEntity.id;
  }

  async deleteEvent(id: number) {
    await this.calendarEventRepository.deleteById(id);
  }

  // Handles updating the start time when the event is dropped
  async onEventDrop(id: number, newStart: string) {
    const event = await this.calendarEventRepository.findById(id);
    if (!event) throw new BadRequestException('Event not found');

    const newStartDate = new Date(newStart);
    const duration = event.end.getTime() - event.start.getTime();
    const newEndDate = new Date(newStartDate.getTime() + duration);

    event.start = newStartDate;
    event.end = newEndDate;
    event.updatedAt = new Date();

    await this.calendarEventRepository.update(event);
  }

  // Handles updating the end time when the event is resized
  async onEventResize(id: number, newEnd: string) {
    const event = await this.calendarEventRepository.findById(id);
    if (!event) throw new BadRequestException('Event not found');

    const newEndDate = new Date(newEnd);
    if (newEndDate <= event.start)
      throw new BadRequestException('End date must be after start date');

    event.end = newEndDate;
    event.updatedAt = new Date();

    await this.calendarEventRepository.update(event);
  }
}
