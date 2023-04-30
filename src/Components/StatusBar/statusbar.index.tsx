import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react"

const api = axios.create(
    {
        baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}:${import.meta.env.VITE_BACKEND_API_PORT}`,
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });

export default () => {

    const [status, setStatus] = useState<number>(1);

    const handleStatus = async () => {
        try {
            const { data } = await api.get("/ping", { timeout: 5000 });
            if (data.message === "Done", data.details === "pong") setStatus(2);
            else setStatus(3);
        } catch (error: any) {
            setStatus(3);
        }
    }

    useEffect(() => {
        handleStatus();
        let ping = setInterval(() => {
            handleStatus();
        }, 7000);

        return () => clearInterval(ping)
    }, []);


    return (
        <div className={`flex items-center px-4 mr-3 text-xs ${status === 1 ? "text-orange-600" : status === 2 ? "text-green-600" : "text-red-600"}`
        } >
            <FontAwesomeIcon icon={faCircle} className="mr-3" />
            <span className="text-xs">
                {
                    status === 1 ? "Connecting..." : status === 2 ? "Connected" : "Disconnected"
                }
            </span>
        </div>
    );

}