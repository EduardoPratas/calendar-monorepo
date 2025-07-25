import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import { CalendarProvider } from './app/pages/calendar/context/calendar.context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <BrowserRouter>
    <CalendarProvider>
      <App />
    </CalendarProvider>
  </BrowserRouter>,
);
