import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { default as App } from './app';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
