import React, { useEffect, useState } from "react";
import Asset from "../Asset/asset.index";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
import Modal from "../Modal/modal.index";
import "./dashboard.index.css";
import DashboardCard from "./dashboard-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default () => {
  const [assetCount, setAssetCount] = useState(0);

  const api = axios.create({ baseURL: "http://localhost:8081" });

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/assets");
      setAssetCount(data.count);
    })();
  }, []);

  return (
    <div className="bsc-dashboard">
      <Navbar />
      <section>
        <Headerbar />
        <div className="bsc-dashboard-card">
          <DashboardCard
            label1="Number of OUs"
            label2="1"
            icon={<FontAwesomeIcon icon={faUsers} />}
          />
          <DashboardCard
            label1="Number of Assets"
            label2={assetCount}
            icon={<FontAwesomeIcon icon={faBoxes} />}
          />
          <DashboardCard
            label1="Number of Transactions"
            label2="0"
            icon={<FontAwesomeIcon icon={faChartLine} />}
          />
        </div>
      </section>
    </div>
  );
};
