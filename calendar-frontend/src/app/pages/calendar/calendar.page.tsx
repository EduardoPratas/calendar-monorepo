import { CalendarView } from './components/calendar-view/calendar-view';
import { CalendarToolbar } from './components/calendar-toolbar/calendar-toolbar';
import { useCalendar } from './hooks/use-calendar';
import { EltEvent } from '../../common/types';

export const CalendarPage = () => {
  const {
    events,
    addEvent,
    onNavigate,
    showIds,
    setShowIds,
    selectedEvent,
    setSelectedEvent,
    setEvents, // Adding setEvents from useCalendar for updates
  } = useCalendar();

  // Function to update events after drop or resize
  const updateEvents = (updatedEvents: EltEvent[]) => {
    setEvents(updatedEvents); // Update events state in useCalendar
  };

  return (
    <div>
      <CalendarToolbar
        addEvent={addEvent}
        showIds={showIds}
        setShowIds={setShowIds}
        selectedEvent={selectedEvent}
      />
      <CalendarView
        onNavigate={onNavigate}
        events={events}
        showIds={showIds}
        setSelectedEvent={setSelectedEvent}
        updateEvents={updateEvents} // Pass updateEvents to CalendarView
      />
    </div>
  );
};
