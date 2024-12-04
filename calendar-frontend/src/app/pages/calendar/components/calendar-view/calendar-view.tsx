import { Calendar, momentLocalizer, stringOrDate, View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import './styles/calendar.scss';
import { EltEvent } from '../../../../common/types';
import { CalendarFormats } from './formats';
import { useCalendarView } from '../../hooks/use-calendar-view';
import { CalendarService } from '../../../../service/calendar.service'; // Correct relative path

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<EltEvent>(Calendar);

interface ICalendarViewProps {
  onNavigate: (date: Date, view: View) => void;
  events: EltEvent[];
  showIds: boolean;
  setSelectedEvent: (event: EltEvent) => void;
  updateEvents: (updatedEvents: EltEvent[]) => void;
}

export const CalendarView = ({
  onNavigate,
  events,
  showIds,
  setSelectedEvent,
  updateEvents, // Add updateEvents here to destructure it from props
}: ICalendarViewProps) => {
  const { components } = useCalendarView(showIds);
  const calendarService = new CalendarService();

// Handles event drop
const onEventDrop = async ({ event, start }: { event: EltEvent; start: stringOrDate }) => {
  await calendarService.onEventDrop(event, start);
  
  const movedEvent = { ...event, start: new Date(start as stringOrDate) }; // Create a new event object with the updated start time
  const updatedEventsList = events.map((existingEvent) => // Create a new array where the updated event replaces the old one
    existingEvent.id === event.id ? movedEvent : existingEvent
  );
  updateEvents(updatedEventsList); // Update the state with the new events array
};

// Handles event resize
const onEventResize = async ({ event, end }: { event: EltEvent; end: stringOrDate }) => {
  await calendarService.onEventResize(event, end);
  const resizedEvent = { ...event, end: new Date(end as stringOrDate) }; // Create a new event object with the updated end time
  const updatedEventsList = events.map((existingEvent) => // Create a new array where the updated event replaces the old one
    existingEvent.id === event.id ? resizedEvent : existingEvent
  );
  // Update the state with the new events array
  updateEvents(updatedEventsList);
};

  return (
    <DnDCalendar
      components={components}
      defaultDate={moment().toDate()}
      events={events}
      onNavigate={onNavigate}
      defaultView="week"
      onSelectEvent={setSelectedEvent}
      localizer={localizer}
      formats={CalendarFormats}
      onEventDrop={onEventDrop}
      onEventResize={onEventResize}
      resizable
      style={{ height: '80vh' }}
      popup={true}
      dayLayoutAlgorithm="no-overlap"
    />
  );
};