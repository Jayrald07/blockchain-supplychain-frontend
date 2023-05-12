import { useEffect, useRef, useState } from "react"
import Headerbar from "../HeaderBar/headerbar.index"
import InputIndex from "../Input/input.index"
import Navbar from "../Navbar/navbar.index"
import "./connections.index.css"
import axios from "axios"
import { host, port } from "../../utilities";
import ButtonIndex from "../Button/button.index"
import { Socket, io } from "socket.io-client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faChevronDown, faEnvelopeOpen, faPlus, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { Modal } from "../Modalv2/modal.index"
import moment from "moment"
import AuthIndex from "../Auth/auth.index"
import useSocket from "../../hooks/useSocket"
import useVerified from "../../hooks/useVerified"
import { useNavigate } from "react-router-dom"
import PromptIndex from "../Prompt/prompt.index"
import promptIndex from "../Prompt/prompt.index"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}:${import.meta.env.VITE_BACKEND_API_PORT}`,
    headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`
    }
});

const modalContents = [

]

const Connection = () => {
    const [channelName, setChannelName] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const [invitesReceived, setInvitesReceived] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [modalContentChoice, setModalContentChoice] = useState(0);
    const [connectedOrganizations, setConnectedOrganizations] = useState([]);
    const [tempLogs, setTempLogs] = useState<{ message: string, state: number }[]>([]);
    const socket: Socket | null = useSocket(`${host}:${port}`);
    const [emailVerified, reloadVar, reloader] = useVerified();
    const navigate = useNavigate();
    const [promptContent, setPromptContent] = useState<{ question?: string, description?: string, buttons?: string[], type?: string, orgId?: string }>({});


    useEffect(() => {
        getConnectedOrganizations();
    }, []);

    useEffect(() => {
        if (socket) {
            socket
                .on("channelInvite", (data) => {
                })
                .on("p2p", data => {
                    setTempLogs((prevState) => {
                        (async () => {
                            if (data.state === 2) {
                                const { data } = await api.get(`/invitesSent`);
                                setInvitesReceived(data.details);
                                getConnectedOrganizations();
                            }
                        })();
                        return [...prevState, data];
                    })
                })
                .on("connection", async (data) => {
                    if (data.action === 'refetch') {
                        await handleGetInviteOrganizations();
                    }
                })
        }
    }, [socket]);

    const getConnectedOrganizations = async () => {
        const { data } = await api.get('/connectedOrganizations');
        setConnectedOrganizations(data.details);
    }

    const handleInvite = async (invitedId: string) => {
        const { data } = await api.post("/sendWs", {
            invitedId
        });
        await handleToggleInvite();
    }

    const handleGetInviteOrganizations = async () => {
        const { data } = await api.get('/getConnectionOrganizations');
        setOrganizations(data.details);
    }

    const handleToggleInvite = async () => {
        setModalContentChoice(1);
        setIsModal(!isModal);

        await handleGetInviteOrganizations();
    }

    const handleGetInvitesReceived = async () => {
        const { data } = await api.get(`/invitesReceived`);
        setInvitesReceived(data.details);
    }

    const handleInviteReceived = async (triggeredBy: number = 1) => {
        setModalContentChoice(2);
        setIsModal(triggeredBy ? !isModal : true);
        await handleGetInvitesReceived();

    }

    const handleGetInvitesSent = async () => {
        const { data } = await api.get(`/invitesSent`);
        setInvitesReceived(data.details);
    }

    const handleInvites = async (triggeredBy: number = 1) => {
        setModalContentChoice(3);
        setIsModal(triggeredBy ? !isModal : true);

        await handleGetInvitesSent();
    }

    const handleInviteResponse = async (status: string, inviteId: string) => {
        const { data } = await api.put(`/inviteResponse`, { status, inviteId });

        await handleInviteReceived(0);
    }

    const handleConnect = async (inviteId: string) => {
        const { data } = await api.put(`/inviteConnect`, { inviteId });
        setModalContentChoice(4);

    }

    const handleConnectedOrganizations = (org: any) => {
        let organization = {
            id: "",
            connectedOrgName: "",
            dateConnected: ""
        }

        if (typeof org.organization_id === "string") {
            organization.id = org.organization_id;
            organization.connectedOrgName = org.invited_organization_id.organization_name;
        } else {
            organization.id = org.organization_id._id;
            organization.connectedOrgName = org.organization_id.organization_name;
        }

        organization.dateConnected = moment(org.dateConnected).format("MMMM D, YYYY");


        return organization;
    }

    const handlePromptClose = () => {
        setPromptContent({});
    }

    const handlePromptResponse = async (response: string) => {

        setPromptContent({});

        if (response !== 'No') {

            switch (promptContent.type) {
                case 'ACCEPT':
                    await handleInviteResponse('ACCEPTED', promptContent.orgId as string);
                    break;
                case 'REJECT':
                    await handleInviteResponse('REJECTED', promptContent.orgId as string);
                    break;
                case 'INVITE':
                    await handleInvite(promptContent.orgId as string)
                    break;
                case 'CONNECT':
                    await handleConnect(promptContent.orgId as string)
                    break;
                case 'CANCEL':
                    // FIX this
                    await handleConnect(promptContent.orgId as string)
                    break;
                default:
                    break;
            }

        }

    }

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
            promptContent && Object.keys(promptContent).length
                ? <PromptIndex question={promptContent.question as string} description={promptContent.description as string} buttons={['Yes', 'No']} onClose={handlePromptClose} handleClick={handlePromptResponse} />
                : null
        }
        <div className="grid grid-cols-5 h-full">
            <Navbar />
            {
                isModal ?
                    <Modal title={["Invite Organization", "Received Invitation", "Sent Invitation", "Logs"][modalContentChoice - 1]} toggleModal={() => setIsModal(!isModal)}>
                        {
                            modalContentChoice === 1 ?
                                <table className="w-full border border-slate-100">
                                    <thead className="bg-slate-100 text-sm text-slate-600">
                                        <tr className="text-left">
                                            <th className="p-2">Organization Name</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-thin">
                                        {
                                            !organizations.length
                                                ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2 text-center" colSpan={3}>No Available Organizations</td>
                                                </tr> : null
                                        }
                                        {
                                            organizations.map((item: any) => (
                                                <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2">{item.organization_name}</td>
                                                    <td>{item.organization_type_id.organization_type_name}</td>
                                                    <td>
                                                        <a onClick={() => {
                                                            setPromptContent({
                                                                question: 'Are you sure to invite this organization?',
                                                                description: 'This will request to this organization for connection',
                                                                buttons: ['Yes', 'No'],
                                                                type: 'INVITE',
                                                                orgId: item._id
                                                            })
                                                        }} role="button" className="underline hover:no-underline py-2 items-center">
                                                            {/* <FontAwesomeIcon icon={faEnvelopeOpen} /> */}
                                                            Invite
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                : modalContentChoice === 2 ? <table className="w-full border border-slate-100">
                                    <thead className="bg-slate-100 text-sm text-slate-600">
                                        <tr className="text-left">
                                            <th className="p-2">Organization Name</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-thin">
                                        {
                                            !invitesReceived.length
                                                ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2 text-center" colSpan={3}>No Received Invitation</td>
                                                </tr> : null
                                        }
                                        {
                                            invitesReceived.map((item: any) => (
                                                <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2">{item.organization_id.organization_name}</td>
                                                    <td>{item.organization_id.organization_type_id.organization_type_name}</td>
                                                    <td className="flex gap-x-3 py-2">

                                                        {
                                                            item.status === "ACCEPTED" ? <div className="flex items-center gap-x-2"><span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                            </span>Pending</div> : item.status === "INVITED" ?
                                                                <>
                                                                    <a onClick={() => setPromptContent({
                                                                        question: 'Are you sure to accept this invite?',
                                                                        description: 'This creates new connection to the requester. This is irriversible',
                                                                        buttons: ['Yes', 'No'],
                                                                        type: 'ACCEPT',
                                                                        orgId: item._id
                                                                    })} role="button" className="underline hover:no-underline py-2 items-center">
                                                                        Accept
                                                                    </a>
                                                                    <a onClick={() => setPromptContent({
                                                                        question: 'Are you sure to reject this invite?',
                                                                        description: 'This prevents the requester and the system to create new connection',
                                                                        buttons: ['Yes', 'No'],
                                                                        type: 'REJECT',
                                                                        orgId: item._id
                                                                    })} role="button" className="underline hover:no-underline py-2 items-center">
                                                                        Reject
                                                                    </a>

                                                                </> : null
                                                        }

                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table> : modalContentChoice === 3 ? <table className="w-full border border-slate-100">
                                    <thead className="bg-slate-100 text-sm text-slate-600">
                                        <tr className="text-left">
                                            <th className="p-2">Organization Name</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-thin">
                                        {
                                            !invitesReceived.length
                                                ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2 text-center" colSpan={3}>No Sent Invitation</td>
                                                </tr> : null
                                        }
                                        {
                                            invitesReceived.map((item: any) => (
                                                <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                    <td className="p-2">{item.invited_organization_id.organization_name}</td>
                                                    <td>{item.invited_organization_id.organization_type_id.organization_type_name}</td>
                                                    <td className="py-2">
                                                        {
                                                            item.status === "INVITED" ? <><div className="flex items-center gap-x-2"><span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                            </span>Pending</div>  <a onClick={() => handleConnect(item._id)} role="button" className="underline hover:no-underline py-2 items-center block">
                                                                    Cancel
                                                                </a></> : item.status === "ACCEPTED" ?
                                                                <><a onClick={() => {
                                                                    setPromptContent({
                                                                        question: 'Are you sure to create a connection now?',
                                                                        description: 'Once it is under processing, you cannot undo it',
                                                                        buttons: ['Yes', 'No'],
                                                                        type: 'CONNECT',
                                                                        orgId: item._id
                                                                    })
                                                                }} role="button" className="underline hover:no-underline py-2 items-center">
                                                                    Connect
                                                                </a></> : null
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table> : <div>
                                    {
                                        tempLogs[tempLogs.length - 1]?.state === 2 ? <div className="flex items-center gap-x-2 text-xs text-green-500"><span className="relative flex h-2 w-2">
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>Completed - <span className="font-light text-slate-700">You may now close this modal</span></div> : <div className="flex items-center gap-x-2 text-xs text-orange-500">
                                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />In Progress -<span className="font-light text-slate-700">Please wait...</span></div>
                                    }
                                    <ul className="list-none p-0 font-light text-xs w-full h-60 overflow-y-auto mt-5">
                                        {
                                            tempLogs.map(log => {
                                                return <><li className={`pb-1 ${log.state ? "text-green-700  font-bold" : ""}`}>{log.message}</li>{log.state === 2 ? <li className={`pb-1 ${log.state ? "font-bold" : ""}`} >-- Done --</li> : null}</>
                                            })
                                        }
                                    </ul>
                                </div>
                        }

                    </Modal> : null
            }
            <div className="col-span-5 sm:col-span-5 md:col-span-4">
                <Headerbar />

                <div className="px-10 pt-20 lg:px-44 md:px-20 sm:px-10 xl:px-24">
                    <h1 className="text-2xl mb-5">Connections</h1>

                    {
                        emailVerified === 'LOADING'
                            ? <div className="flex justify-center">
                                <FontAwesomeIcon icon={faSpinner} size="xs" className="animate-spin" />
                            </div>
                            : emailVerified === 'VERIFIED'
                                ?
                                <>
                                    <div className="flex gap-x-2 justify-end mb-4">

                                        <button onClick={() => handleInvites()} className="border rounded pb-2 pt-1 px-3 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faEnvelopeOpen} className="text-xs" />
                                        </button>
                                        <button onClick={() => handleInviteReceived()} className="border rounded pb-2 pt-1 px-3.5 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faArrowDown} className="text-xs" />
                                        </button>
                                        <button onClick={handleToggleInvite} className="border rounded pb-2 pt-1 px-3.5 hover:bg-gray-100">
                                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                        </button>
                                    </div>


                                    <table className="w-full border border-slate-100">
                                        <thead className="bg-slate-100 text-sm text-slate-600">
                                            <tr>
                                                <td className="p-2">Connected to</td>
                                                <td>Date Connected</td>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-thin">
                                            {
                                                !connectedOrganizations.length
                                                    ? <tr className="hover:bg-slate-50 border-b-slate-100">
                                                        <td colSpan={3} className="p-2 text-center">No connections</td>
                                                    </tr> : null
                                            }
                                            {
                                                connectedOrganizations.map((item: any) => {
                                                    item = handleConnectedOrganizations(item);

                                                    return (
                                                        <tr key={item.id} className="hover:bg-slate-50 border-b-slate-100">
                                                            <td className="p-2">{item.connectedOrgName}</td>
                                                            <td>{
                                                                item.dateConnected
                                                            }
                                                            </td>
                                                        </tr>
                                                    )
                                                })

                                            }
                                        </tbody>
                                    </table>
                                </>
                                : <div className="flex justify-center py-10">
                                    <small>Your email is not verified yet. Please verify it first to use this feature.</small>
                                </div>

                    }





                </div>
            </div>
        </div>
    </>
}


export default () => <AuthIndex Component={Connection} />