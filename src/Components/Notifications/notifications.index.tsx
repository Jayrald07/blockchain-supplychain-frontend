import { useEffect, useState } from "react"
import { api as globalApi } from "../../services/http";
import { HttpMethod } from "../../services/http";
import NavbarIndex from "../Navbar/navbar.index";
import HeaderbarIndex from "../HeaderBar/headerbar.index";
import { host, port, validateAndReturn } from "../../utilities";
import { faChevronLeft, faChevronRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSocket from "../../hooks/useSocket";
import useVerified from "../../hooks/useVerified";
import { useNavigate } from "react-router-dom";

export default () => {
  const [notifications, setNotifications] = useState([]);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const socket = useSocket(`${host}:${port}`);
  const [fetching, setFetching] = useState(true);
  const [emailVerified, reloadVar, reloader] = useVerified();
  const navigate = useNavigate();

  const handlePage = (type: number) => {
    if (type) {
      if (page !== Math.ceil(count / limit)) {
        setFetching(true);
        setPage(page + 1)
      }
    } else {
      if (page !== 1) {
        setFetching(true);
        setPage(page - 1)
      }
    }
  }

  const handleNotifs = async () => {
    const data = await globalApi("/getNotifs", HttpMethod.POST, {
      viewed: [true, false],
      limit,
      skip: (page - 1) * limit
    })

    const response = validateAndReturn(data);

    setNotifications(response.notifs);
    setCount(response.length);
    setFetching(false);
  }

  useEffect(() => {

    (async () => {


      await handleNotifs();

    })();

    if (socket) {
      socket
        .on('notif', async (data) => {
          if (data.action === "refetch") {
            await handleNotifs();
          }
        })
    }

  }, [limit, page, socket])

  return <>
    {
      emailVerified === 'NOT VERIFIED'
        ? <div className="bg-red-500 text-center py-2">
          <small className="text-white">Looks like your email is not verified yet. Go to your <a href="#"
            onClick={() => {
              navigate("/account");
            }}
            className="underline"
          >account</a> to verify</small>
        </div>
        : null
    }
    <div className="grid grid-cols-5 h-full">
      <NavbarIndex />
      <div className="col-span-4 sm:col-span-4 md:col-span-4">
        <HeaderbarIndex />
        <div className="px-10 pt-20 lg:px-44 md:px-20 sm:px-10 xl:px-24 mb-5">
          <h1 className="text-2xl mb-5">Notifications</h1>
          {
            fetching
              ? <div className="text-center py-3">
                <FontAwesomeIcon icon={faSpinner} size="xs" className="animate-spin" />
              </div>
              : !notifications.length
                ? <small className="block text-center py-3">No Notifications</small>
                : null
          }
          <div className="grid grid-cols-3">
          </div>
          {
            !fetching
              ? notifications.map((notification: any) => {
                return <div key={notification._id} className="p-2 border bg-white mb-1">
                  <h1 className="text-sm">{notification.title}</h1>
                  <p className="font-light text-xs">{notification.description}</p>
                  <time className="text-xs font-light">{new Date(notification.createdAt).toLocaleString()}</time>
                </div>
              }) : null
          }

          {
            notifications.length
              ? <div className="grid grid-cols-3 mt-4">
                <div className="col-start-1 col-span-2 grid justify-center justify-items-center">
                  <div className="mb-3">
                    <button onClick={() => {
                      if (page !== 1) {
                        setFetching(true)
                        setPage(1)
                      }
                    }} className={`${page === 1 ? "bg-gray-200 text-gray-400" : ''} border rounded rounded-tr-none rounded-br-none py-1 px-2`}><FontAwesomeIcon icon={faChevronLeft} size="xs" /><FontAwesomeIcon icon={faChevronLeft} size="xs" /></button>
                    <button onClick={() => handlePage(0)} className={`${page === 1 ? " bg-gray-200 text-gray-400" : ''} border rounded border-l-0 rounded-tr-none rounded-br-none rounded-tl-none rounded-bl-none py-1 px-2`}><FontAwesomeIcon icon={faChevronLeft} size="xs" /></button>
                    <button onClick={() => handlePage(1)} className={`${page === Math.ceil(count / limit) ? "bg-gray-200 text-gray-400" : ''} border rounded rounded-tr-none rounded-br-none rounded-tl-none rounded-bl-none py-1 px-2 border-l-0`}><FontAwesomeIcon icon={faChevronRight} size="xs" /></button>
                    <button onClick={() => {
                      if (page !== Math.ceil(count / limit)) {
                        setFetching(true)
                        setPage(Math.ceil(count / limit))
                      }
                    }} className={`${page === Math.ceil(count / limit) ? "bg-gray-200 text-gray-400" : ''} border rounded rounded-tl-none rounded-bl-none py-1 px-2 border-l-0`}><FontAwesomeIcon icon={faChevronRight} size="xs" /><FontAwesomeIcon icon={faChevronRight} size="xs" /></button>
                  </div>
                  <small>
                    {
                      notifications.length
                        ? `${page} / ${Math.ceil(count / limit)}`
                        : null
                    }
                  </small>
                </div>
                <div className="col-start-3 justify-self-end">
                  <select className="bg-white p-2 border" onChange={(e) => {
                    setPage(1);
                    setFetching(true)
                    setLimit(parseInt(e.target.value))
                  }}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
              : null
          }


        </div>
      </div>
    </div>
  </>
}