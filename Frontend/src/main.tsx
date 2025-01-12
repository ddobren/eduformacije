import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { Analytics } from '@vercel/analytics/react'; // Samo ako koristimo Vercel servis
import { SpeedInsights } from '@vercel/speed-insights/react'; // Samo ako koristimo Vercel servis

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
