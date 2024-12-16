import { useEffect, useState } from 'react';
import moment, { unitOfTime, Moment } from 'moment/moment';
import { View } from 'react-big-calendar';
import { EltEvent } from '../../../common/types';
import { CalendarService } from '../../../service/calendar.service';

export const useCalendar = () => {
  const calendarService = new CalendarService();
  const [events, setEvents] = useState<EltEvent[]>([]);
  const [showIds, setShowIds] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EltEvent | undefined>();

  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    const today = moment();
    fetchEvents(today.startOf('week'), today.clone().endOf('week'));
  }, []);

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

  const onNavigate = async (newDate: Date, view: View) => {
    const newMutableDate = moment(newDate);
    const unitOfTime = viewToUnitOfTime(view);
    await fetchEvents(
      newMutableDate.startOf(unitOfTime),
      newMutableDate.clone().endOf(unitOfTime)
    );
  };

  const addEvent = async (event: Omit<EltEvent, 'id'>) => {
    const {
      data: { id },
    } = await calendarService.createEvent(
      event.title,
      moment(event.start),
      moment(event.end)
    );
    setEvents((events) => [...events, { ...event, id }]);
    toggleModal(); // Close modal after adding the event
  };

  const editEvent = async (updatedEvent: EltEvent) => {
    try {
      await calendarService.updateEvent(updatedEvent.id, updatedEvent);
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === updatedEvent.id ? { ...updatedEvent } : e
        )
      );
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleEventDrop = async (event: EltEvent, newStart: Date) => {
    try {
      await calendarService.onEventDrop(event, newStart);
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id ? { ...e, start: newStart } : e
        )
      ); // Update state to trigger re-render
    } catch (error) {
      console.error('Error dropping event:', error);
    }
  };

  const handleEventResize = async (event: EltEvent, newEnd: Date) => {
    try {
      await calendarService.onEventResize(event, newEnd);
      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id ? { ...e, end: newEnd } : e
        )
      ); // Update state to trigger re-render
    } catch (error) {
      console.error('Error resizing event:', error);
    }
  };

  const viewToUnitOfTime = (view: View): unitOfTime.StartOf => {
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

  return {
    events,
    setEvents,
    showIds,
    setShowIds,
    onNavigate,
    showModal,
    toggleModal,
    addEvent,
    editEvent,
    handleEventDrop,
    handleEventResize, 
    selectedEvent,
    setSelectedEvent,
  };
};
