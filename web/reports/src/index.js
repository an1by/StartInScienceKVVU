import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter, Route,
    RouterProvider
} from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from "./pages/Login";
import Panel from "./pages/Panel";
import CreateReport from "./pages/CreateReport";
import Report from "./pages/Report";
import {AuthProvider} from "./authentication/AuthProvider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>
    },
    {
        path: "/panel",
        element: <Panel/>
    },
    {
        path: "/createReport",
        element: <CreateReport/>
    },
    {
        path: "/report/:id",
        element: <Report/>
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
