import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Assuming you have a CSS file for styling

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
