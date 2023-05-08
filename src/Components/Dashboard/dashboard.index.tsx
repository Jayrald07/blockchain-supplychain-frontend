import { useEffect, useRef, useState } from "react";
import Headerbar from "../HeaderBar/headerbar.index";
import Navbar from "../Navbar/navbar.index";
import DashboardCard from "./dashboard-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faUsers,
  faChartLine,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Action, HttpResposne, host, port, validateAndReturn } from "../../utilities";
import Auth from "../Auth/auth.index";
import Chart from "chart.js/auto";
import ChannelIndex from "../Channel/channel.index";
import useVerified from "../../hooks/useVerified";
import { useNavigate } from "react-router-dom";
import { HttpMethod, api as globalApi } from "../../services/http";

const Dashboard = () => {
  const [assetCount, setAssetCount] = useState(0);
  const ctxRef = useRef(null);
  const [channelId, setChannelId] = useState("")
  const [emailVerified, reloadVar, reloader] = useVerified();
  const navigate = useNavigate();
  const [ouCount, setOuCount] = useState(0);
  const [pendingInvitesCount, setPendingInvitesCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleChannelId = (channelId: string) => {
    setChannelId(channelId);
  }

  useEffect(() => {

  }, [ctxRef]);

  useEffect(() => {
    (async () => {
      if (channelId.trim()) {
        api.post('/chaincode', {
          'action': Action.ASSETS,
          'args': {
            channelId
          }
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then(({ data }) => {
          let value = validateAndReturn(data);

          setAssetCount(value.length);

        }).catch(console.error);
      }

      const response = await globalApi("/getInviteOu", HttpMethod.POST, {
        status: 'INVITED'
      });

      let ou = validateAndReturn(response)

      setOuCount(ou.length);

      const pendingInvites = await globalApi("/invitesReceived", HttpMethod.GET);
      let _invites = validateAndReturn(pendingInvites);

      setPendingInvitesCount(_invites.length)


      const tx: HttpResposne = await globalApi("/chaincode", HttpMethod.POST, {
        action: Action.LOGS,
        args: {
          channelId
        }
      });

      const data = validateAndReturn(response);

      setTransactionsCount(data.length)

    })()
  }, [channelId]);

  return (
    <>
      {
        emailVerified === 'NOT VERIFIED'
          ? <div className="bg-red-500 text-center py-2">
            <small>Looks like your email is not verified yet. Go to your <a href="#"
              onClick={() => {
                navigate("/account");
              }}
              className="underline"
            >account</a> to verify</small>
          </div>
          : null
      }
      <div className="grid grid-cols-5 h-full">
        <Navbar />
        <section className="col-span-5 sm:col-span-5 md:col-span-4">
          <Headerbar />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 pt-20 gap-5 mb-5">
            <div className="block w-full">
              <label className="text-sm block w-full mb-2">Channels</label>
              <ChannelIndex handleValue={handleChannelId} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 gap-5 mb-5">
            <DashboardCard
              label1="Organization Units"
              label2={ouCount}
              icon={<FontAwesomeIcon icon={faUsers} className="w-full" />}
            />
            <DashboardCard
              label1="Assets"
              label2={assetCount}
              icon={<FontAwesomeIcon icon={faBoxes} className="w-full" />}
            />
            <DashboardCard
              label1="Transactions"
              label2={transactionsCount}
              icon={<FontAwesomeIcon icon={faChartLine} className="w-full" />}
            />
            <DashboardCard
              label1="Pending Invites"
              label2={pendingInvitesCount}
              icon={<FontAwesomeIcon icon={faEnvelope} className="w-full" />}
            />
          </div>
        </section>
      </div>
    </>
  )
};


export default () => <Auth Component={Dashboard} />;