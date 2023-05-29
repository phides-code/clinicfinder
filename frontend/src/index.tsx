import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import { UserProvider } from './components/UserContext';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
