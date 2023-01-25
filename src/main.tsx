import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Test from "./test";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.index";
import Headerbar from "./Components/HeaderBar/headerbar.index";
import Dashboard from "./Components/Dashboard/dashboard.index";
import Asset from "./Components/Asset/asset.index";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <h1>Notice</h1>
        <p>This will be used for validation of current user's session</p>
      </>
    ),
    errorElement: <h1>Error, Bhiee.</h1>,
  },
  {
    path: "/login",
    element: <App />,
  },
  {
    path: "/navbar",
    element: <Navbar />,
  },
  {
    path: "/header",
    element: <Headerbar />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/asset",
    element: <Asset />,
  },
  {
    path: "/test",
    element: <Test />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
