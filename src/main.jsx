import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { HabitProvider } from './context/HabitContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <HabitProvider>
          <App />
        </HabitProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
