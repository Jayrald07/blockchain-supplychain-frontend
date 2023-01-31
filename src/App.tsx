import React from "react";
import "./App.css";
import Logo from "./assets/logo.png";
import Login from "./Components/Login/login.index";
import QR from "./Components/QR/qr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="App">
      <section className="app-left">
        <img src={Logo} />
        <h1 className="page-title">ChainDirect</h1>
        <p>Securing your supply chain transactions</p>
        <QR
          label="Scan item's QR Code"
          icon={<FontAwesomeIcon icon={faQrcode} />}
        />
        {/* The Scan QR Code component is here */}
      </section>
      <section className="app-right">
        <Login />
      </section>
    </div>
  );
}

export default App;
