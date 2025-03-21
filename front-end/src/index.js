import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import { Login } from './components/login_form';
import {Dashboard} from './components/Dashboard'
import { ErrorPage } from './error_page';
import { Planner } from './components/Planner';
import { AuthProvider } from './context/Authprovider';
import PersistLogin from './components/PersistLogin'
import RequireAuth  from './hooks/requireAuth';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <PersistLogin />, // Wrap all routes with PersistLogin
    children: [
      {
        path: "/", // Login route
        element: <Login />,
      },
      {
        path: "/dashboard", // Protected dashboard route
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/plan", // Protected plan route
        element: (
          <RequireAuth>
            <Planner />
          </RequireAuth>
        ),
      },
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);