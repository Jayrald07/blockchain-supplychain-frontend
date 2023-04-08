import { useEffect, useState } from "react";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
// import "./dashboard.index.css";
import DashboardCard from "./dashboard-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { host, port } from "../../utilities";
import Auth from "../Auth/auth.index";

const Dashboard = () => {
  const [assetCount, setAssetCount] = useState(0);

  const api = axios.create({ baseURL: `${host}:${port}` });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/assets", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAssetCount(data.count);
      } catch (error: any) {
        alert("Error")
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-5 h-full">
      <Navbar />
      <section className="col-span-4">
        <Headerbar />
        <div className="grid grid-cols-3 px-20 py-20 gap-5">
          <DashboardCard
            label1="Number of OUs"
            label2="1"
            icon={<FontAwesomeIcon icon={faUsers} className="w-full" />}
          />
          <DashboardCard
            label1="Number of Assets"
            label2={assetCount}
            icon={<FontAwesomeIcon icon={faBoxes} className="w-full" />}
          />
          <DashboardCard
            label1="Number of Transactions"
            label2="0"
            icon={<FontAwesomeIcon icon={faChartLine} className="w-full" />}
          />
        </div>
      </section>
    </div>
  )
};


export default () => <Auth Component={Dashboard} />;