// calendar-frontend/src/app/pages/calendar/calendar.page.tsx
import React, { useState } from 'react';
import { CalendarView } from './components/calendar-view/calendar-view';
import { CalendarToolbar } from './components/calendar-toolbar/calendar-toolbar';
import { EventModal } from './components/calendar-view/event-modal';
import { useCalendarContext } from './context/calendar.context'; // Import context
import { EltEvent } from '../../common/types';

export const CalendarPage = () => {
  const {
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
  } = useCalendarContext();

  const [editingEvent, setEditingEvent] = useState<EltEvent | null>(null);

  const handleSaveEvent = async (event: Omit<EltEvent, 'id'>) => {
    if (editingEvent) {
      // Edit event logic
      const updatedEvent = { ...editingEvent, ...event };
      const updatedEvents = events.map((ev) =>
        ev.id === editingEvent.id ? updatedEvent : ev
      );
      setEvents(updatedEvents);
    } else {
      // Add new event logic
      await addEvent(event);
    }
    toggleModal(); // Close modal after saving
    setEditingEvent(null); // Clear editing state
  };

  const handleEditEvent = (event: EltEvent) => {
    setEditingEvent(event);
    toggleModal();
  };

  return (
    <div>
      <CalendarToolbar
        toggleModal={toggleModal}
        addEvent={addEvent}
        showIds={showIds}
        setShowIds={setShowIds}
        selectedEvent={selectedEvent}
        editEvent={handleEditEvent} // Pass editEvent here
      />
      {showModal && (
        <EventModal
          isVisible={showModal}
          onClose={toggleModal}
          onSave={handleSaveEvent}
        >
          {editingEvent && (
            <>
              <label>
                Title:
                <input
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, title: e.target.value })
                  }
                />
              </label>
              <label>
                Start:
                <input
                  type="datetime-local"
                  value={new Date(editingEvent.start).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      start: new Date(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                End:
                <input
                  type="datetime-local"
                  value={new Date(editingEvent.end).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      end: new Date(e.target.value),
                    })
                  }
                />
              </label>
            </>
          )}
        </EventModal>
      )}
      <CalendarView
        onNavigate={onNavigate}
        events={events}
        showIds={showIds}
        setSelectedEvent={setSelectedEvent}
        updateEvents={setEvents}
      />
    </div>
  );
};
