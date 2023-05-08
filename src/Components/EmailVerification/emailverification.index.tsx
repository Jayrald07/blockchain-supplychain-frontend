import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { host, port } from "../../utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faKey, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import InputIndex from "../Input/input.index";
import Logo from "../../assets/logo.png";
import AlertIndex from "../Alert/alert.index";

const api = axios.create({ baseURL: `${host}:${port}` });
export default () => {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [valid, setIsValid] = useState('exists');
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertContent, setAlertContent] = useState<{ title?: string, content?: string, type?: string }>({});


  const token = query.get('token');

  const handleValidate = async (e: any) => {
    e.preventDefault()


    const { data } = await api.post("/validateEmailVerification", {
      token: token,
      username,
      password
    });

    if (data.message === "Error") setAlertContent({
      title: 'Verification Error',
      content: data.details,
      type: 'error'
    })
    else {
      setIsValid("verified");
      setAlertContent({
        title: 'Verification Success',
        content: data.details,
        type: 'success'
      })

    }

  }

  useEffect(() => {
    (async () => {
      const { data } = await api.post("/getEmailVerification", {
        token: token
      })

      if (data.message === "Error") setIsValid('invalid');
      else setIsValid('exists')

    })();
  }, [token])

  return <div className="bg-slate-100 h-full">
    {
      alertContent && Object.keys(alertContent).length
        ? <AlertIndex title={alertContent.title as string} type={alertContent.type as string} content={alertContent.content as string} handleClose={() => {
          setAlertContent({});
        }} />
        : null
    }
    {
      valid === 'pending'
        ? <h1 className="text-center py-3">Validating Token <FontAwesomeIcon icon={faSpinner} size="xs" className="animate-spin" /></h1>
        : null
    }
    {
      valid === 'invalid'
        ? <div className="py-3 text-center flex flex-col justify-center items-center h-full">
          <h1 className="mb-3">Invalid Token</h1>
          <button className="text-xs font-light border rounded p-2 bg-white" onClick={() => {
            navigate("/login")
          }}>Back to Login</button>
        </div>
        : null
    }
    {
      valid === "exists"
        ? <div className="flex justify-center pt-10 h-full items-center">
          <div className="px-5 grid">
            <img src={Logo} className="w-48 mb-5 justify-self-center flex" />
            <h1 className="mb-3 self-start text-sm">Please input login credentials to verify your email</h1>
            <form onSubmit={handleValidate} className="grid bg-white border rounded p-4 shadow-md">
              <InputIndex icon={<FontAwesomeIcon icon={faUser} />} type="text" label="Username" value={username} handler={(e: any) => setUsername(e.target.value)} />
              <InputIndex icon={<FontAwesomeIcon icon={faKey} />} type="password" label="Password" value={password} handler={(e: any) => setPassword(e.target.value)} />
              <button className="border rounded p-2 px-3 bg-white text-xs justify-self-end">Verify</button>
            </form>
          </div>
        </div>
        : null
    }

    {
      valid === "verified"
        ? <div className="text-center flex flex-col h-full justify-center items-center">
          <h1 className="mb-3">Email verified! <FontAwesomeIcon icon={faCheckCircle} size="xs" className="text-green-500" /></h1>
          <button className="text-xs font-light border rounded p-2 bg-white" onClick={() => {
            navigate("/login")
          }}>Back to Login</button>
        </div>
        : null
    }
  </div>

}