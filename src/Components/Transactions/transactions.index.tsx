import { useEffect, useState } from "react"
import AuthIndex from "../Auth/auth.index"
import Headerbar from "../HeaderBar/headerbar.index"
import Navbar from "../Navbar/navbar.index"
import ChannelIndex from "../Channel/channel.index"
import { HttpMethod, api } from "../../services/http"
import { Action, HttpResposne, validateAndReturn } from "../../utilities"
import { useNavigate } from "react-router-dom"
import useChannel from "../../hooks/useChannel"
import useVerified from "../../hooks/useVerified"
import AlertIndex from "../Alert/alert.index"

interface Logs {
    action: string,
    assetIds: string[],
    description: string,
    initiated: string,
    timestamp: number
}

const Transaction = () => {

    const [channelId, setChannelId] = useState("");
    const [activities, setActivities] = useState<Logs[]>([]);
    const navigate = useNavigate();
    const channels = useChannel();
    const [emailVerified, reloadVar, reloader] = useVerified();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [alertContent, setAlertContent] = useState<{ title?: string, content?: string, type?: string }>({})


    const getDateToday = () => {
        var currentDate = new Date();

        var year = currentDate.getFullYear();
        var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
        var day = ('0' + currentDate.getDate()).slice(-2);

        var formattedDate = year + '-' + month + '-' + day;

        return formattedDate;
    }

    const handleValue = (channelId: string) => {
        setChannelId(channelId);
    }

    const handleRedirectConnection = () => {
        navigate("/connections")
    }

    useEffect(() => {
        setStartDate(getDateToday())
        setEndDate(getDateToday())
    }, []);

    useEffect(() => {
        (async () => {

            if (channelId.trim()) {
                if (startDate && endDate) {
                    if (startDate > endDate) {
                        setAlertContent({
                            title: 'Invalid time range',
                            content: 'Please fix the start date and end date',
                            type: "error"
                        })
                    } else {
                        const body = {
                            action: Action.LOGS,
                            args: {
                                channelId,
                                start: "0",
                                offset: "100",
                                startDate,
                                endDate
                            }
                        }
                        const response: HttpResposne = await api("/chaincode", HttpMethod.POST, body);
                        const data = validateAndReturn(response);
                        console.log(data.logs)

                        setActivities(data.logs);
                    }
                }

            }

        })();
    }, [channelId, startDate, endDate]);

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
        {
            alertContent && Object.keys(alertContent).length
                ? <AlertIndex type={alertContent.type as string} title={alertContent.title as string} content={alertContent.content as string} handleClose={() => setAlertContent({})} />
                : null
        }
        <div className="grid grid-cols-5 h-full">
            <Navbar />
            <div className="col-span-5 sm:col-span-4 md:col-span-4 overflow-y-auto">
                <Headerbar />
                <div className="px-10 py-20 sm:px-10 md:px-16 lg:px-24">
                    {
                        channels.length && channels[0].trim()
                            ?
                            <>
                                <h1 className="text-2xl mb-5">Transactions Logs</h1>

                                <div className="grid grid-cols-4">
                                    <div>
                                        <label className="block text-sm mb-2">Channels</label>
                                        <ChannelIndex handleValue={handleValue} />
                                    </div>
                                    <div className="col-start-4 flex justify-end items-center">
                                        <div>
                                            <label className="block text-sm">Start date</label>
                                            <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light" />
                                        </div>
                                        <div>
                                            <label className="block text-sm">End date</label>
                                            <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" className="p-1 px-2 outline-none border mr-2 text-sm font-light" />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full whitespace-nowrap border-slate-100">
                                        <thead className="w-full bg-slate-100 text-sm text-slate-600 text-left">
                                            <tr>
                                                {/* <th className="p-2">Processed By</th> */}
                                                <th className="p-2">Date</th>
                                                <th>Action</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-thin">
                                            {
                                                !activities.length
                                                    ? <tr className="hover:bg-slate-50 border-b border-b-slate-100">
                                                        <td className="p-2 text-center" colSpan={5}>No Transactions</td>
                                                    </tr> : null
                                            }
                                            {
                                                activities.map(activity => {
                                                    return <tr key={`${activity.timestamp}-${activity.initiated}`} className="hover:bg-slate-50 border-b-slate-100">
                                                        {/* <td className="py-2 px-2 pr-4">{activity.initiated}</td> */}
                                                        <td className="py-2 px-2 pr-4">{new Date(activity.timestamp * 1000).toLocaleString()}</td>
                                                        <td className="pr-4">
                                                            <span className="text-xs font-semibold text-white bg-green-400 rounded p-1 cursor-default">
                                                                {
                                                                    activity.action
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="pr-4">{activity.description}</td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                            :
                            <div className="text-center grid ">
                                <h1>You don't have any connections to other organizations.</h1>
                                <small className="font-light block mb-3">Please connect to atleast 1 organization to show this page.</small>
                                <button className="border rounded text-xs p-2 px-4 justify-self-center hover:bg-slate-100" onClick={handleRedirectConnection}>Create connection</button>
                            </div>
                    }


                </div>
            </div>
        </div></>

}

export default () => <AuthIndex Component={Transaction} />