// calendar-frontend/src/app/pages/calendar/components/calendar-toolbar/calendar-toolbar.tsx
import React from 'react';
import { EltEvent } from 'calendar-frontend/src/app/common/types';
import { useCalendarContext } from '../../context/calendar.context'; // Import context
import { ToolbarStyle } from './styles/calendar-toolbar-style';

interface CalendarToolbarProps {
  toggleModal: () => void;
  addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  showIds: boolean;
  setShowIds: React.Dispatch<React.SetStateAction<boolean>>;
  selectedEvent: EltEvent | undefined;
  editEvent: (event: EltEvent) => void;  // This is now a prop
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  toggleModal,
  addEvent,
  showIds,
  setShowIds,
  selectedEvent,
  editEvent,
}) => {

  const handleEditEvent = () => {
    if (selectedEvent) {
      // Logic to handle event editing, probably opening a modal
      editEvent(selectedEvent); // Calls the editEvent passed as a prop
    }
  };

  return (
    <div css={ToolbarStyle}>
      <button data-testid="add-event-btn" onClick={toggleModal}>
        Add event
      </button>
      <button
        data-testid="edit-event-btn"
        onClick={handleEditEvent} // Handle the edit event
        disabled={!selectedEvent} // Disable the button if no event is selected
      >
        Edit event
      </button>
      <label htmlFor="show-ids-checkbox">
        <input
          id="show-ids-checkbox"
          type="checkbox"
          checked={showIds} // Controlled input
          onChange={(e) => setShowIds(e.target.checked)} // Handle change for checkbox
        />
        Show ids
      </label>
    </div>
  );
};
