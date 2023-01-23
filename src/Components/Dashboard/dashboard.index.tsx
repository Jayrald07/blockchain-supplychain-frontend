import React from "react";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
import "./dashboard.index.css";

export default () => {
  return (
    <div className="bsc-dashboard">
      <Navbar />
      <Headerbar />
    </div>
  );
};
