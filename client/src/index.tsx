import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import CreateContact from 'CreateContact';
import EditContact from 'EditContact';
import Home from 'Home';
import Layout from 'Layout';

import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/contacts/new',
        element: <CreateContact />,
      },
      {
        path: '/contacts/:contactId',
        element: <EditContact />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

serviceWorkerRegistration.register();

window.addEventListener('beforeinstallprompt', function (event) {
  // Don't display the standard one
  event.preventDefault();

  // Save the event to use it later
  window.promptEvent = event;
});
