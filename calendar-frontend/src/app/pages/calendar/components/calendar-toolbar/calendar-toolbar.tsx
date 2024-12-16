import { EltEvent } from '../../../../common/types';
import { Dispatch } from 'react';
import { useCalendarToolbar } from '../../hooks/use-calendar-toolbar';
import { ToolbarStyle } from './styles/calendar-toolbar-style';
import React, { useState } from 'react';
import { EventModal as Modal } from '../calendar-view/event-modal';

interface ICalendarToolbarProps {
  addEvent: (event: Omit<EltEvent, 'id'>) => Promise<void>;
  showIds: boolean;
  setShowIds: Dispatch<boolean>;
  selectedEvent?: EltEvent;
  toggleModal: () => void;
  editEvent: (event: EltEvent) => Promise<void>;
}

export const CalendarToolbar = ({
  toggleModal,
  addEvent,
  showIds,
  setShowIds,
  selectedEvent,
  editEvent,
}: ICalendarToolbarProps) => {
  return (
    <div css={ToolbarStyle}>
      <button data-testid="add-event-btn" onClick={toggleModal}>
        Add event
      </button>
      <button
        data-testid="edit-event-btn"
        onClick={() => editEvent(selectedEvent!)}
        disabled={!selectedEvent}
      >
        Edit event
      </button>
      <label htmlFor="show-ids-checkbox">
        <input
          id="show-ids-checkbox"
          type="checkbox"
          defaultChecked={showIds}
          onClick={(e) => setShowIds(e.currentTarget.checked)}
        />
        Show ids
      </label>
    </div>
  );
};