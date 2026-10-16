import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { setApplicantId } from './services/szhpApiClient';
import './index.css';

// No sign-in in this build; the demo applicant is fixed.
setApplicantId(import.meta.env.VITE_DEMO_APPLICANT_ID ?? 'MMOEI_19853045999');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
