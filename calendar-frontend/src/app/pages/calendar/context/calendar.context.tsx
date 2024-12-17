// calendar-frontend/src/app/pages/calendar/context/calendar.context.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EltEvent } from '../../../common/types';
import moment, { Moment, unitOfTime } from 'moment/moment';
import { CalendarService } from '../../../service/calendar.service';

// Define the context type
interface CalendarContextType {
  events: EltEvent[];
  setEvents: React.Dispatch<React.SetStateAction<EltEvent[]>>;
  showIds: boolean;
  setShowIds: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EltEvent | undefined;
  setSelectedEvent: (event: EltEvent) => void;
  showModal: boolean;
  toggleModal: () => void;
  addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  editEvent: (event: EltEvent) => Promise<void>;
  onNavigate: (newDate: Date, view: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Hook to use the CalendarContext
export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
};

// Provider props
interface CalendarProviderProps {
  children: ReactNode;
}

// CalendarProvider implementation
export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const calendarService = new CalendarService();
  const [events, setEvents] = useState<EltEvent[]>([]);
  const [showIds, setShowIds] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EltEvent | undefined>();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal((prev) => !prev);

  // Fetch events
  const fetchEvents = async (start: Moment, end: Moment) => {
    const { data } = await calendarService.getEventsForRange(start, end);
    const processedEvents: EltEvent[] = data.map((e) => ({
      id: e.id,
      title: e.name,
      start: new Date(e.start),
      end: new Date(e.end),
    }));
    setEvents(processedEvents);
  };

  // Handle navigation
  const onNavigate = async (newDate: Date, view: string) => {
    const newMutableDate = moment(newDate);
    const unitOfTime = viewToUnitOfTime(view);
    await fetchEvents(
      newMutableDate.startOf(unitOfTime),
      newMutableDate.clone().endOf(unitOfTime)
    );
  };

  // Add a new event
  const addEvent = async (event: Omit<EltEvent, 'id'>) => {
    const {
      data: { id },
    } = await calendarService.createEvent(
      event.title,
      moment(event.start),
      moment(event.end)
    );
    setEvents((prevEvents) => [...prevEvents, { ...event, id }]);
  };

  // Edit an existing event
  const editEvent = async (updatedEvent: EltEvent) => {
    await calendarService.updateEvent(updatedEvent.id, updatedEvent);
    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id === updatedEvent.id ? { ...updatedEvent } : e))
    );
  };

  // Utility function to map views to time units
  const viewToUnitOfTime = (view: string): unitOfTime.StartOf => {
    switch (view) {
      case 'day':
      case 'week':
      case 'month':
        return view;
      case 'agenda':
        return 'month';
      default:
        return 'week';
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        showIds,
        setShowIds,
        selectedEvent,
        setSelectedEvent,
        showModal,
        toggleModal,
        addEvent,
        editEvent,
        onNavigate,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
