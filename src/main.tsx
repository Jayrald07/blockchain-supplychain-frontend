import React, { ReactNode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.index";

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
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
