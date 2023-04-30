import { useEffect, useState } from "react"
import AuthIndex from "../Auth/auth.index"
import Headerbar from "../HeaderBar/headerbar.index"
import Navbar from "../Navbar/navbar.index"
import ChannelIndex from "../Channel/channel.index"
import { HttpMethod, api } from "../../services/http"
import { Action, HttpResposne, validateAndReturn } from "../../utilities"

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

    const handleValue = (channelId: string) => {
        setChannelId(channelId);
    }

    useEffect(() => {
        (async () => {

            if (channelId.trim()) {
                const body = {
                    action: Action.LOGS,
                    args: {
                        channelId
                    }
                }
                const response: HttpResposne = await api("/chaincode", HttpMethod.POST, body);
                const data = validateAndReturn(response);

                setActivities(data);

            }

        })();
    }, [channelId]);

    return <div className="grid grid-cols-5 h-full">
        <Navbar />
        <div className="col-span-5 sm:col-span-5 md:col-span-4 overflow-y-auto">
            <Headerbar />
            <div className="px-24 py-20">
                <h1 className="text-2xl mb-5">Transactions</h1>

                <div className="grid grid-cols-4">
                    <div>
                        <label className="block text-sm mb-2">Channels</label>
                        <ChannelIndex handleValue={handleValue} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="block whitespace-nowrap border-slate-100">
                        <thead className="bg-slate-100 text-sm text-slate-600 text-left">
                            <tr>
                                <th className="p-2">Processed By</th>
                                <th className="p-2">Date</th>
                                <th>Action</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-thin">
                            {
                                activities.map(activity => {
                                    return <tr key={`${activity.timestamp}-${activity.initiated}`} className="hover:bg-slate-50 border-b-slate-100">
                                        <td className="py-2 px-2 pr-4">{activity.initiated}</td>
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

            </div>
        </div>
    </div>

}

export default () => <AuthIndex Component={Transaction} />