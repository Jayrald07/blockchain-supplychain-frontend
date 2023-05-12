import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell, faChevronLeft, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import "./headerbar.index.css";
import Statusbar from "../StatusBar/statusbar.index";
import { useNavigate } from "react-router-dom";
import { Action, host, port, validateAndReturn } from "../../utilities";
import axios from "axios";
import { Socket } from "socket.io-client";
import useSocket from "../../hooks/useSocket";

import { HttpMethod, api as globalApi } from "../../services/http";

const api = axios.create({ baseURL: `${host}:${port}` });

export default () => {

  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const socket: Socket | null = useSocket(`${host}:${port}`);
  const [isOnlyAccessing, setIsOnlyAccessing] = useState("");

  const handleNotifs = async () => {
    const { data } = await api.post("/getNotifs", {
      viewed: [false],
      limit: 0
    }, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`,
      },
    });

    if (data.message === "Done") setNotifs(data.details.notifs);
  }

  const handleViewNotifs = async () => {

    if (notifs.length) {
      const { data } = await api.post("/viewedNotifs", {}, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      });
      if (data.message === "Done") await handleNotifs();
    }

  }

  const handleValidateSwitch = async () => {
    const response = await globalApi("/validateSwitched", HttpMethod.POST);

    if (response.message === "Done") {
      if (response.details.message === "Done") {
        if (response.details.details) setIsOnlyAccessing(response.details.details)
      }
    }

  }

  const handleSwitchBack = async () => {
    const response = await globalApi("/switchBack", HttpMethod.POST);

    const cleaned = validateAndReturn(response);

    if (cleaned.message === "Done") {
      localStorage.setItem("token", cleaned.token);
      location.reload();
    }

  }

  useEffect(() => {
    (async () => {
      await handleNotifs();
      await handleValidateSwitch();
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      socket
        .on('notif', async (data) => {
          if (data.action === "refetch") {
            await handleNotifs();
          }
        })
    }
  }, [socket]);

  return (
    <header className="border-b grid grid-cols-2">
      <Statusbar />
      <ul className="flex justify-end text-slate-700">
        {
          isOnlyAccessing.trim()
            ? <li>
              <a title="Switch Back" href="#" onClick={() => handleSwitchBack()} className="p-5 px-6 block hover:bg-gray-100">
                <FontAwesomeIcon icon={faArrowLeft} />
              </a>
            </li> : null
        }
        <li className="notification-tab" onMouseLeave={handleViewNotifs}>
          <a href="#" className="p-5 px-6 block hover:bg-gray-100 relative z-10">
            <FontAwesomeIcon icon={faBell} />
            {
              notifs.length
                ?
                <span className="absolute bg-red-600 text-xs p-1 px-2 rounded-full text-white right-1 top-3">{notifs.length}</span> : null
            }
            <div className="cursor-default notif-pop bg-white shadow-md rounded absolute border w-64 top-full -left-24">
              <div className=" px-3 py-2 border-b grid grid-cols-2 items-center">
                <h1 className="text-sm">Notifications</h1>
                <a href="#" onClick={() => {
                  navigate("/notifications")
                }} className="underline text-xs font-light justify-self-end cursor-pointer">Show All</a>
              </div>
              <ul className="text-xs overflow-y-auto max-h-48">
                {
                  notifs.map((notif: any) => {
                    return <li key={notif._id} className="grid py-4 px-3 bg-slate-50 border-b">
                      <span>{notif.title}</span>
                      <span className="font-light mb-2">{notif.description}</span>
                      <span className="font-light">{new Date(notif.createdAt).toLocaleString()}</span>
                    </li>
                  })
                }
                {
                  !notifs.length
                    ? <small className="text-center block p-2 font-light">No notifications</small> : null
                }
              </ul>
            </div>
          </a>
        </li>

        <li>
          <a href="#" onClick={() => navigate("/account")} className="p-5 px-6 block hover:bg-gray-100">
            <FontAwesomeIcon icon={faUser} />
          </a>
        </li>
        <li>
          <a className="p-5 block hover:bg-gray-100" href="#" onClick={() => navigate("/logout")}>
            <FontAwesomeIcon icon={faSignOut} />
          </a>
        </li>
      </ul>
    </header>
  );
};
