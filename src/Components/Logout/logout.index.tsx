import { useEffect } from "react"
import { redirect } from "react-router-dom";

export default () => {

    useEffect(() => {
        localStorage.removeItem("token");
        location.href = "/login";
    }, []);

    return <div>
        <h1>Logging out...</h1>
    </div>

}