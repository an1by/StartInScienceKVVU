import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter, Route,
    RouterProvider
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./authentication/AuthProvider";
import Login from "./pages/Login";
import Control from "./pages/Control";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/control",
        element: <Control/>
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
