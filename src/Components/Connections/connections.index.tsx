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
import { faArrowDown, faChevronDown, faEnvelopeOpen, faPlus } from "@fortawesome/free-solid-svg-icons"
import { Modal } from "../Modalv2/modal.index"
import moment from "moment"

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}:${import.meta.env.VITE_BACKEND_API_PORT}`,
    headers: {
        Authorization: `Basic ${localStorage.getItem("token")}`
    }
});

const modalContents = [

]

export default () => {
    const [channelName, setChannelName] = useState("");
    const [organizations, setOrganizations] = useState([]);
    const socket = useRef<Socket>();
    const [invitesReceived, setInvitesReceived] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [modalContentChoice, setModalContentChoice] = useState(0);
    const [connectedOrganizations, setConnectedOrganizations] = useState([]);

    useEffect(() => {
        socket.current?.on("channelInvite", (data) => {
            console.log(data);
        })
    }, [socket]);

    useEffect(() => {
        socket.current = io("http://localhost:8081", {
            query: {
                token: localStorage.getItem("token")
            }
        });
        getConnectedOrganizations();
    }, []);

    const getConnectedOrganizations = async () => {
        const { data } = await api.get('/connectedOrganizations');
        console.log(data.details)
        setConnectedOrganizations(data.details);
    }

    const handleInvite = async (invitedId: string) => {
        console.log(invitedId)

        const { data } = await api.post("/sendWs", {
            invitedId
        });

        console.log(data);
    }

    const handleToggleInvite = async () => {
        setModalContentChoice(1);
        setIsModal(!isModal);

        const { data } = await api.get('/organizations');
        console.log(data.details)
        setOrganizations(data.details);
    }

    const handleInviteReceived = async (triggeredBy: number = 1) => {
        setModalContentChoice(2);
        setIsModal(triggeredBy ? !isModal : true);
        const { data } = await api.get(`/invitesReceived`);
        console.log(data.details)
        setInvitesReceived(data.details);

    }

    const handleInvites = async (triggeredBy: number = 1) => {
        setModalContentChoice(3);
        setIsModal(triggeredBy ? !isModal : true);

        const { data } = await api.get(`/invitesSent`);
        console.log(data.details)
        setInvitesReceived(data.details);
    }

    const handleInviteResponse = async (status: string, inviteId: string) => {
        const { data } = await api.put(`/inviteResponse`, { status, inviteId });
        console.log(data.details)

        await handleInviteReceived(0);
    }

    const handleConnect = async (inviteId: string) => {
        const { data } = await api.put(`/inviteConnect`, { inviteId });
        console.log(data.details);

        await handleInvites(0);

        location.reload()

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

    return <div className="grid grid-cols-5 h-full">
        <Navbar />
        {
            isModal ?
                <Modal title={["Invite Organization", "Invitation Received", "Invitation Sent"][modalContentChoice - 1]} toggleModal={() => setIsModal(!isModal)}>
                    {
                        modalContentChoice === 1 ?
                            <table className="w-full border border-slate-100">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <td className="p-2">Organization Name</td>
                                        <td>Type</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-thin">
                                    {
                                        organizations.map((item: any) => (
                                            <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                <td className="p-2">{item.organization_name}</td>
                                                <td>{item.organization_type_id.organization_type_name}</td>
                                                <td>
                                                    <a onClick={() => handleInvite(item._id)} role="button" className="underline hover:no-underline py-2 items-center">
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
                                    <tr>
                                        <td className="p-2">Organization Name</td>
                                        <td>Type</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-thin">
                                    {
                                        invitesReceived.map((item: any) => (
                                            <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                <td className="p-2">{item.organization_id.organization_name}</td>
                                                <td>{item.organization_type_id}</td>
                                                <td className="flex gap-x-3 py-2">

                                                    {
                                                        item.status === "ACCEPTED" ? <div className="flex items-center gap-x-2"><span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                        </span>Pending</div> : item.status === "INVITED" ?
                                                            <>
                                                                <a onClick={() => handleInviteResponse('ACCEPTED', item._id)} role="button" className="underline hover:no-underline py-2 items-center">
                                                                    {/* <FontAwesomeIcon icon={faEnvelopeOpen} /> */}
                                                                    Accept
                                                                </a>
                                                                <a onClick={() => handleInviteResponse('REJECTED', item._id)} role="button" className="underline hover:no-underline py-2 items-center">
                                                                    {/* <FontAwesomeIcon icon={faEnvelopeOpen} /> */}
                                                                    Reject
                                                                </a>

                                                            </> : null
                                                    }

                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table> : <table className="w-full border border-slate-100">
                                <thead className="bg-slate-100 text-sm text-slate-600">
                                    <tr>
                                        <td className="p-2">Organization Name</td>
                                        <td>Type</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-thin">
                                    {
                                        invitesReceived.map((item: any) => (
                                            <tr key={item._id} className="hover:bg-slate-50 border-b-slate-100">
                                                <td className="p-2">{item.invited_organization_id.organization_name}</td>
                                                <td>{item.organization_type_id}</td>
                                                <td>
                                                    {
                                                        item.status === "INVITED" ? <div className="flex items-center gap-x-2"><span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                                        </span>Pending</div> : item.status === "ACCEPTED" ?
                                                            <a onClick={() => handleConnect(item._id)} role="button" className="underline hover:no-underline py-2 items-center">
                                                                {/* <FontAwesomeIcon icon={faEnvelopeOpen} /> */}
                                                                Connect
                                                            </a> : null
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                    }

                </Modal> : null
        }
        <div className="col-span-4">
            <Headerbar />
            <div className="p-10 pt-20 px-32 flex gap-x-2 justify-end">
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
            <div className="px-32">
                <table className="w-full border border-slate-100">
                    <thead className="bg-slate-100 text-sm text-slate-600">
                        <tr>
                            <td className="p-2">Organization Name</td>
                            <td>Date Connected</td>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-thin">
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
            </div>
        </div>
    </div>
}