import React from 'react';
import ReactDOM from 'react-dom/client';
import './global-styles.css';
import App from './components/App';
import { AuthProvider } from './providers/AuthProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);