import { EltEvent } from 'calendar-frontend/src/app/common/types';
import React, { useState } from 'react';

interface IEventModalProps {
  isVisible: boolean; // Controla a visibilidade do modal
  onClose: () => void; // Função chamada ao fechar o modal
  onSave: (event: Omit<EltEvent, 'id'>) => void; // Função chamada ao salvar o evento
  children?: React.ReactNode; // Conteúdo opcional adicional (flexibilidade)
}

export const EventModal = ({ isVisible, onClose, onSave, children }: IEventModalProps) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSave = () => {
    if (title && start && end) {
      onSave({ title, start: new Date(start), end: new Date(end) });
      onClose(); // Fecha o modal após salvar
    } else {
      alert('Please fill in all fields'); // Validação simples
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        {children && <div className="modal-header">{children}</div>}
        <h2>{children ? 'Edit Event' : 'Add Event'}</h2>
        <label>
          Title event-modal.tsx:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </label>
        <label>
          Start:
          <input
            type="datetime-local"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label>
          End:
          <input
            type="datetime-local"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
