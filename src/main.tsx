import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import './styles/base.css';
import './styles/components.css';
import './styles/tonight.css';
import './styles/sky.css';
import './styles/planets.css';
import './styles/live.css';
import './styles/solar.css';
import './styles/learn.css';
import './styles/diary.css';
import './styles/observe.css';
import App from './App';

registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
