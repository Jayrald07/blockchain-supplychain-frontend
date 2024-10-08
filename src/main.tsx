import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Test from "./test";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.index";
import Headerbar from "./Components/HeaderBar/headerbar.index";
import Dashboard from "./Components/Dashboard/dashboard.index";
import Asset from "./Components/Asset/asset.index";
import Register from "./Components/Register/register.index";
import Scanqr from "./Components/ScanQR/scanqr.index";
import Login from "./Components/Login/login.index";
import AccountIndex from "./Components/Account/account.index";
import Connections from "./Components/Connections/connections.index";
import LogoutIndex from "./Components/Logout/logout.index";
import TransfersIndex from "./Components/Transfers/transfers.index";
import TransactionsIndex from "./Components/Transactions/transactions.index";
import SettingsIndex from "./Components/Settings/settings.index";
import EmailverificationIndex from "./Components/EmailVerification/emailverification.index";
import NotificationsIndex from "./Components/Notifications/notifications.index";
import ClientauthIndex from "./Components/ClientAuth/clientauth.index";
import ClientsettingsIndex from "./Components/ClientSettings/clientsettings.index";
import GlobaltransactionIndex from "./Components/GlobalTransaction/globaltransaction.index";

const Redire = () => {
  useEffect(() => {
    location.href = "/login"
  })

  return <></>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Redire />,
    errorElement: (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1>Page is not found.</h1>
        <a
          href="/dashboard"
          style={{
            textDecoration: "none",
            backgroundColor: "var(--dark-blue)",
            color: "var(--light)",
            padding: "10px 20px",
            fontSize: "10pt",
            borderRadius: "100px",
          }}
        >
          Back to Dashboard
        </a>
      </div>
    ),
  },
  {
    path: "/login",
    element: <ClientauthIndex><Login /></ClientauthIndex>,
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
    path: "/register",
    element: <Register />,
  },
  {
    path: "/scan",
    element: <Scanqr />,
  },
  {
    path: "/account",
    element: <AccountIndex />,
  },
  {
    path: "/connections",
    element: <Connections />
  },
  {
    path: "/transfer",
    element: <TransfersIndex />
  },
  {
    path: "/transaction",
    element: <TransactionsIndex />
  },
  {
    path: "/settings",
    element: <SettingsIndex />
  },
  {
    path: "/logout",
    element: <LogoutIndex />
  }
  ,
  {
    path: "/email-verification",
    element: <EmailverificationIndex />
  },
  {
    path: "/notifications",
    element: <NotificationsIndex />
  },
  {
    path: "/client-settings",
    element: <ClientsettingsIndex />
  }
  ,
  {
    path: "/global-transactions",
    element: <GlobaltransactionIndex />
  }

]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // <React.StrictMode>
  <RouterProvider router={router} />
  // </React.StrictMode>
);
