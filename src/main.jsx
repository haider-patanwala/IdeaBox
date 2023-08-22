import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import LoadingState from './components/context/LoadingState';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoadingState>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoadingState>
  </React.StrictMode>,
);
