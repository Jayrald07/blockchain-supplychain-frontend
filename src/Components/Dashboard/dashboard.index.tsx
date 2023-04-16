import { useEffect, useRef, useState } from "react";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
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
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [assetCount, setAssetCount] = useState(0);
  const ctxRef = useRef(null);

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

    // new Chart(ctxRef.current, {
    //   type: 'bar',
    //   data: {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [{
    //       label: '# of Votes',
    //       data: [12, 19, 3, 5, 2, 3],
    //       borderWidth: 1
    //     }]
    //   },
    //   options: {
    //     scales: {
    //       y: {
    //         beginAtZero: true
    //       }
    //     }
    //   }
    // });

  }, [ctxRef]);

  return (
    <div className="grid grid-cols-5 h-full">
      <Navbar />
      <section className="col-span-4">
        <Headerbar />
        <div className="grid grid-cols-3 px-20 py-20 gap-5 mb-5">
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
        <section className="px-20">
          <canvas ref={ctxRef}></canvas>
        </section>
      </section>
    </div>
  )
};


export default () => <Auth Component={Dashboard} />;