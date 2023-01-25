import React from "react";
import Asset from "../Asset/asset.index";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
import Modal from "../Modal/modal.index";
import "./dashboard.index.css";

export default () => {
  return (
    <div className="bsc-dashboard">
      <Navbar />
      <section>
        <Headerbar />
        <Asset />
      </section>
      <Modal />
    </div>
  );
};
