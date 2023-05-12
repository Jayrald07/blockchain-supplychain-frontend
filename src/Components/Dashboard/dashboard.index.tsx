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
import AlertIndex from "../Alert/alert.index";

const Dashboard = () => {
  const [assetCount, setAssetCount] = useState(0);
  const ctxRef = useRef(null);
  const lineRef = useRef(null);
  const [channelId, setChannelId] = useState("")
  const [emailVerified, reloadVar, reloader] = useVerified();
  const navigate = useNavigate();
  const [ouCount, setOuCount] = useState(0);
  const [pendingInvitesCount, setPendingInvitesCount] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [canv, setCanv] = useState<Chart>()
  const [alertContent, setAlertContent] = useState<{ title?: string, content?: string, type?: string }>({})

  const api = axios.create({ baseURL: `${host}:${port}` });

  const handleChannelId = (channelId: string) => {
    setChannelId(channelId);
  }

  const getDateToday = () => {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);

    var formattedDate = year + '-' + month + '-' + day;

    return formattedDate;
  }

  useEffect(() => {
    let datavals = [0, 0, 0, 0];

    transactions.map((transaction: any) => {
      if (transaction.isReturned) datavals[0]++;
      if (transaction.isRejected) datavals[1]++;
      if (transaction.isCancelled) datavals[3]++
    })

    datavals[2] = transactions.length - datavals.reduce((a, b) => a + b);

    console.log(datavals)

    if (ctxRef.current) {

      if (canv) {
        canv.destroy();
      }
      let value = new Chart(ctxRef.current, {
        type: 'bar',
        data: {
          labels: ['Returned', 'Rejected', 'Done', 'Cancelled'],
          datasets: [{
            data: datavals,
            borderWidth: 1,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      setCanv(value);
      // new Chart(lineRef.current, {
      //   type: 'bar',
      //   data: {
      //     labels: ['Returned', 'Rejected', 'Done', 'Cancelled'],
      //     datasets: [{
      //       data: datavals,
      //       borderWidth: 1,
      //       backgroundColor: [
      //         'rgba(255, 99, 132, 0.2)',
      //         'rgba(255, 99, 132, 0.2)',
      //         'rgba(75, 192, 192, 0.2)',
      //         'rgba(201, 203, 207, 0.2)'
      //       ]
      //     }]
      //   },
      //   options: {
      //     responsive: true,
      //     plugins: {
      //       legend: {
      //         display: false
      //       }
      //     }
      //   }
      // });


    }
  }, [ctxRef, lineRef, transactions]);

  useEffect(() => {
    setStartDate(getDateToday())
    setEndDate(getDateToday())
  }, []);

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

        if (startDate && endDate) {
          if (startDate > endDate) {
            setAlertContent({
              title: 'Invalid time range',
              content: 'Please fix the start date and end date',
              type: "error"
            })
          } else {

            const tx: HttpResposne = await globalApi("/chaincode", HttpMethod.POST, {
              action: Action.TRANSACTIONS,
              args: {
                channelId,
                startDate,
                endDate
              }
            });
            const data = validateAndReturn(tx);
            console.log(data);
            setTransactions(data);
            setTransactionsCount(data.length)
          }
        }


        const response = await globalApi("/getInviteOu", HttpMethod.POST, {
          status: 'INVITED'
        });

        let ou = validateAndReturn(response)

        setOuCount(ou.length);

        const pendingInvites = await globalApi("/invitesReceived", HttpMethod.GET);
        let _invites = validateAndReturn(pendingInvites);

        setPendingInvitesCount(_invites.length)



      } else {
      }


    })()
  }, [channelId, endDate, startDate]);

  return (
    <>
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
      {
        alertContent && Object.keys(alertContent).length
          ? <AlertIndex type={alertContent.type as string} title={alertContent.title as string} content={alertContent.content as string} handleClose={() => setAlertContent({})} />
          : null
      }
      <div className="grid grid-cols-5 h-full">
        <Navbar />
        <section className="col-span-5 sm:col-span-4 md:col-span-4 sm:overflow-y-hidden md:overflow-y-hidden">
          <Headerbar />
          <h1 className="text-2xl mb-5 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 pt-20">Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 gap-5 mb-5">

            <div className="col-span-4 md:col-span-1">
              <label className="text-sm block w-full mb-2">Channels</label>
              <ChannelIndex handleValue={handleChannelId} />
            </div>
            <div className="mb-5 md:mb-0 col-span-4 md:col-start-3 md:col-span-3 md:flex justify-end items-end gap-x-3">
              <div className="mb-3 md:mb-0">
                <label className="block text-sm">Start date</label>
                <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light w-full bg-white" />
              </div>
              <div className="mb-3 md:mb-0">
                <label className="block text-sm">End date</label>
                <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light w-full bg-white" />
              </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-1 w-full h-full md:grid-cols-1 lg:grid-cols-2 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 pt-20 gap-5 mb-5">
            <div className="w-full h-full">
              <h1 className="mb-2">Transaction Status</h1>
              <canvas ref={ctxRef}></canvas>
            </div>
          </div>

        </section>
      </div>
    </>
  )
};


export default () => <Auth Component={Dashboard} />;