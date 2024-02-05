import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './frame/App.jsx';

import './main.css';

if (self.DEBUG) {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
