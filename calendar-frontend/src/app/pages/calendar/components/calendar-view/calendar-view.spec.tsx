import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import './styles/calendar.scss';
import { CalendarFormats } from './formats';
import { useCalendar } from '../../hooks/use-calendar'; // Import useCalendar hook
import { EltEvent } from '../../../../common/types';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<EltEvent>(Calendar);

export const CalendarView = () => {
  const {
    events,
    onNavigate,
    handleEventDrop,
    handleEventResize,
    setSelectedEvent,
  } = useCalendar();

  return (
    <DnDCalendar
      defaultDate={moment().toDate()}
      events={events}
      defaultView="week"
      localizer={localizer}
      formats={CalendarFormats}
      onNavigate={onNavigate}
      onEventDrop={({ event, start }) => handleEventDrop(event, start as Date)}
      onEventResize={({ event, end }) => handleEventResize(event, end as Date)}
      onSelectEvent={setSelectedEvent}
      resizable
      style={{ height: '80vh' }}
      popup
      dayLayoutAlgorithm="no-overlap"
    />
  );
};
