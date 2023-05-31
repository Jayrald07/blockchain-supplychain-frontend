import { ReactNode, useEffect, useState } from "react"
import fs from "fs";
import axios from "axios";
import InputIndex from "../Input/input.index";
import AlertIndex from "../Alert/alert.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}:${import.meta.env.VITE_BACKEND_API_PORT}`,
});

const apiClient = axios.create({
  baseURL: `${location.origin}:${import.meta.env.VITE_CLIENT_PORT}`,
});

export default ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState("checking");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [alertContent, setAlertContent] = useState<{ title?: string, description?: string, type?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);


  const handleSetup = async (e: any) => {

    e.preventDefault();

    if (password.trim() && repassword.trim() && password === repassword) {
      setIsSubmitting(true);

      let { data } = await api.post("/setupClient", {
        username,
        password
      })

      if (data.message === "Done") {

        let { data: response } = await apiClient.post("/access_code", {
          access_code: data.details.access_code
        })

        if (response.message === "Done") {
          setAlertContent({
            type: "success",
            title: "Credential Saved Successfully",
            description: response.details
          })
          location.reload()
        } else {
          setAlertContent({
            type: "error",
            title: "Error saving access token",
            description: response.details
          })
        }
      } else {
        setAlertContent({
          type: "error",
          title: "Error saving credential",
          description: data.details
        })
      }

      setIsSubmitting(false);
    }

  }


  useEffect(() => {

    (async () => {

      let { data } = await apiClient.get("/access_code");

      console.log(data)

      if (data.message === "Error") setStatus("none");
      else if (data.message === "Done") setStatus("done")

    })();


  }, []);

  if (status === "done") {
    return <>{children}</>
  } else if (status === "checking") {
    return <div className="bg-slate-100 h-full flex justify-center items-center flex-col">
      <h1 className="mb-2">Checking Client </h1> <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
  } else {

    return <div className="bg-slate-100 h-full flex justify-center items-center">

      <div className="border p-5 rounded-sm bg-white w-2/5 shadow-md">
        {
          !isSubmitting
            ?
            <>
              {
                alertContent && Object.keys(alertContent).length
                  ? <AlertIndex title={alertContent.title as string} content={alertContent.description as string} type={alertContent.type as string} handleClose={() => {
                    setAlertContent({})
                  }} />
                  : null
              }
              <h1 className="mb-1">Initial Setup</h1>
              <small className="mb-3 block font-light">The following credential will be used when accessing the settings page. Make sure to provide a secure password.</small>
              <form onSubmit={handleSetup}>
                <InputIndex placeholder="juandelacruz07" label="Username" type="text" handler={(e: any) => setUsername(e.target.value)} value={username} />
                <div className="mb-2"></div>
                <InputIndex label="Password" type={`${showPass ? 'text' : 'password'}`} handler={(e: any) => setPassword(e.target.value)} value={password} />
                {
                  password.trim() && repassword.trim()
                    ?
                    password === repassword
                      ? null
                      : <small className="text-red-600">Not Matched!</small>
                    : null
                }
                <div className="mb-3"></div>
                <InputIndex label="Re-Password" type={`${showPass ? 'text' : 'password'}`} handler={(e: any) => setrePassword(e.target.value)} value={repassword} />
                {
                  password.trim() && repassword.trim()
                    ?
                    password === repassword
                      ? null
                      : <small className="text-red-600">Not Matched!</small>
                    : null
                }
                <div className="mb-3"></div>
                <div className="flex gap-x-1 items-center">
                  <input type="checkbox" checked={showPass} onChange={() => setShowPass(!showPass)} />
                  <label className="text-sm font-light">Show Password</label>
                </div>
                <div className="mb-3"></div>

                <div className="flex justify-end">
                  <button className={`text-sm border rounded-sm  py-2 px-3 ${password.trim() && repassword.trim()
                    ?
                    password === repassword
                      ? 'bg-white text-black'
                      : 'bg-slate-50 text-slate-300'
                    : 'bg-slate-50 text-slate-300'
                    } `}>Save</button>
                </div>
              </form>
            </>
            : <div className="text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>

        }
      </div>
    </div>
  }

}