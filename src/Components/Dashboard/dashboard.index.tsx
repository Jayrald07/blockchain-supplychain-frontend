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
import useChannel from "../../hooks/useChannel";
import { DatePicker } from "antd"
import moment from "moment"
import dayjs from "dayjs"
import "moment-timezone"

const { RangePicker } = DatePicker


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
  const [lineCanv, setLineCanv] = useState<Chart>()
  const [alertContent, setAlertContent] = useState<{ title?: string, content?: string, type?: string }>({})
  const channels = useChannel();
  const [weekLabels, setWeekLabels] = useState<string[]>([]);
  const [weekData, setWeekData] = useState<number[]>([]);

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

  const handleRedirectConnection = () => {
    navigate("/connections")
  }

  const handleWeek = async (ds: string) => {
    const tx: HttpResposne = await globalApi("/chaincode", HttpMethod.POST, {
      action: Action.WEEK,
      args: {
        channelId,
        startDate: moment(ds).startOf("week").format("yyyy-MM-DD")
      }
    });
    let response = validateAndReturn(tx);
    setWeekLabels(response.labels);
    setWeekData(response.data)
  }

  useEffect(() => {
    let datavals = [0, 0, 0, 0];

    transactions.map((transaction: any) => {
      if (transaction.isReturned) datavals[0]++;
      if (transaction.isRejected) datavals[1]++;
      if (transaction.isCancelled) datavals[3]++
    })

    datavals[2] = transactions.length - datavals.reduce((a, b) => a + b);

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
    }

  }, [ctxRef, transactions]);


  useEffect(() => {
    if (lineRef.current) {

      if (lineCanv) {
        lineCanv.destroy();
      }
      let value = new Chart(lineRef.current, {
        type: 'line',
        data: {
          labels: weekLabels,
          datasets: [{
            data: weekData,
            borderColor: 'rgb(75, 192, 192)',
            fill: false,
            tension: 0
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      setLineCanv(value);
    }
  }, [weekData, weekLabels, lineRef]);

  useEffect(() => {
    setStartDate(getDateToday())
    setEndDate(getDateToday())
  }, []);

  useEffect(() => {
    (async () => {


      if (channelId.trim()) {

        await handleWeek(moment().tz("Asia/Manila").format("yyyy-MMM-DD"))

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
                endDate,
                statuses: []
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
      console.log(moment("2023-05-08", "YYYY-MM-DD").startOf("week").format("YYYY-MM-DD"));

    })()
  }, [channelId, endDate, startDate]);

  const dateFooter = () => {
    return <div className="flex gap-x-4 justify-end px-4">
      <div>
        <a onClick={() => {
          setStartDate(getDateToday())
          setEndDate(getDateToday())
        }}>Today</a>
      </div>
      <div>
        <a onClick={() => {
          let yesterday = moment().subtract({ day: 1 }).format("YYYY-MM-DD")
          setStartDate(yesterday)
          setEndDate(yesterday)
        }}>Yesterday</a>
      </div>
    </div>
  }

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
        <section className="col-span-5 sm:col-span-4 md:col-span-4 overflow-auto">
          <Headerbar />
          {
            channels.length && channels[0].trim()
              ? <div className="overflow-y-auto">

                <h1 className="text-2xl mb-5 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 pt-20">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-5 px-10 lg:px-32 md:px-20 sm:px-10 xl:px-20 gap-5 mb-5 items-end">

                  <div className="col-span-4 md:col-span-1">
                    <label className="text-sm block w-full mb-2">Channels</label>
                    <ChannelIndex handleValue={handleChannelId} />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm block w-full mb-2">Select Date</label>

                    <RangePicker
                      disabledDate={(current) => current && current > moment().endOf('day')}
                      value={[
                        dayjs(startDate),
                        dayjs(endDate)
                      ]}
                      className="w-full z-0 rounded-none"
                      onChange={(_, str) => {
                        if (str[0].trim()) {
                          console.log(_, str)
                          setStartDate(str[0]);
                          setEndDate(str[1]);
                        }
                      }} renderExtraFooter={dateFooter} />
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
                  <div className="w-full h-full">
                    <h1 className="mb-2">Weekly transactions</h1>
                    <DatePicker size={"middle"} picker="week" format={"YYYY-MM-DD"} onChange={(_, ds) => handleWeek(ds)} className="w-full" />
                    <canvas ref={lineRef}></canvas>
                  </div>
                </div>
              </div> : <div className="text-center grid pt-20 ">
                <h1>You don't have any connections to other organizations.</h1>
                <small className="font-light block mb-3">Please connect to atleast 1 organization to show this page.</small>
                <button className="border rounded text-xs p-2 px-4 justify-self-center hover:bg-slate-100" onClick={handleRedirectConnection}>Create connection</button>
              </div>

          }
        </section>
      </div>
    </>
  )
};


export default () => <Auth Component={Dashboard} />;