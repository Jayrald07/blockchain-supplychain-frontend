import { useEffect } from "react"
import useLocalstoragevalidation from "../../hooks/useLocalstoragevalidation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
export default ({ Component }: any) => {
    const history = useNavigate();

    const isCurrentLogin = useLocalstoragevalidation();

    useEffect(() => {
        if (isCurrentLogin === "invalid") history("/login");
    }, [isCurrentLogin]);


    return isCurrentLogin === "valid" ? <Component /> : <div className="flex items-center justify-center flex-col h-full">
        <h1 className="mb-3">Validating Session</h1>
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>;
}