import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';

import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('date-range')
  async getEvents(@Query('start') start: string, @Query('end') end: string) {
    return this.calendarService.getEvents(start, end);
  }

  @Post('create-event')
  async createEvent(@Body() payload: EventPayload) {
    const id = await this.calendarService.addEvent(payload);
    return { message: 'Event created', id };
  }

  @Delete('delete-event/:id')
  async deleteEvent(@Param('id') id: number) {
    await this.calendarService.deleteEvent(id);
    return { message: 'Event deleted', id };
  }

  @Patch('event-drop/:id')
  async onEventDrop(
    @Param('id') id: number,
    @Body('newStart') newStart: string,
  ) {
    await this.calendarService.onEventDrop(id, newStart);
    return { message: 'Event dropped', id };
  }

  @Patch('event-resize/:id')
  async onEventResize(
    @Param('id') id: number,
    @Body('newEnd') newEnd: string,
  ) {
    await this.calendarService.onEventResize(id, newEnd);
    return { message: 'Event resized', id };
  }
}
