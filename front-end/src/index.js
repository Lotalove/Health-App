import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import { Login, Signup } from './components/login_form';
import {Dashboard} from './components/Dashboard'
import { ErrorPage } from './error_page';
import { Planner } from './components/Planner';
import { AuthProvider } from './context/Authprovider';
import { RoutinesProvider } from './context/RoutineProvider';
import PersistLogin from './components/PersistLogin'
import RequireAuth  from './hooks/requireAuth';
import { Tracker } from './components/Tracker';
import { HomePage } from './components/HomePage';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import GoalTracking from './components/Goals';

const router = createBrowserRouter([
  {
    element: <PersistLogin/>, // Wrap all routes with PersistLogin
    children: [
      {
        path: "/", // Login route
        element: <HomePage />,
      },
      {
        path: "/login", // Login route
        element: <Login />,
      },
      {
        path: "/signup", // Login route
        element: <Signup/>,
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
        {
        path: "/goals", // Protected plan route
        element: (
          <RequireAuth>
            <GoalTracking />
          </RequireAuth>
        ),
      },
      {
        path: "/track", // Protected tracking route
        element: (
          <RequireAuth>
            <Tracker/>
          </RequireAuth>
        ),
      }
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
    <RoutinesProvider>
      <RouterProvider router={router} />
    </RoutinesProvider>
    </AuthProvider>
  </React.StrictMode>
);