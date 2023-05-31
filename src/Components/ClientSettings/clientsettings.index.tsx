import { useEffect, useState } from "react"
import InputIndex from "../Input/input.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faKey, faSignOut, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AlertIndex from "../Alert/alert.index";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_HOST}:${import.meta.env.VITE_BACKEND_API_PORT}`,
});

const apiClient = axios.create({
  baseURL: `${location.origin}:8443`,
});

const SignInClient = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [alertContent, setAlertContent] = useState<{ title?: string, description?: string, type?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: any) => {
    setIsSubmitting(true)
    e.preventDefault();

    let { data } = await api.post("/authClient", {
      username,
      password
    })


    if (data.message !== "Authorized") {
      setAlertContent({
        title: "Sign In Error",
        description: data.details,
        type: "error"
      })
    } else {
      localStorage.setItem("client_token", data.token);
      location.reload();
    }

    setIsSubmitting(false)

  }

  if (!localStorage.getItem("client_token")) {
    return <div className="flex items-center justify-center ">
      {
        alertContent && Object.keys(alertContent).length
          ? <AlertIndex title={alertContent.title as string} content={alertContent.description as string} type={alertContent.type as string} handleClose={() => {
            setAlertContent({})
          }} />
          : null
      }

      {
        !isSubmitting
          ?
          <div className="w-3/12 p-3 px-4 border rounded-sm bg-white shadow-md">
            <a href="/" className="text-sm font-light mb-4 block"><FontAwesomeIcon icon={faChevronLeft} /> Back</a>
            <h1 className="mb-3">Client Access</h1>
            <form onSubmit={handleSignIn}>
              <InputIndex placeholder="juandelacruz07" label="Username" type="text" handler={(e: any) => setUsername(e.target.value)} value={username} icon={<FontAwesomeIcon icon={faUser} />} />
              <div className="mb-3"></div>
              <InputIndex label="Password" type={`${showPass ? 'text' : 'password'}`} handler={(e: any) => setPassword(e.target.value)} value={password} icon={<FontAwesomeIcon icon={faKey} />} />
              <div className="mb-3"></div>

              <div className="flex gap-x-1 items-center">
                <input type="checkbox" checked={showPass} onChange={() => setShowPass(!showPass)} />
                <label className="text-sm font-light">Show Password</label>
              </div>
              <div className="mb-3"></div>
              <div className="flex justify-end">
                <button className='text-sm border rounded-sm  py-2 px-3'>Sign In</button>
              </div>
            </form>
          </div>
          : <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      }

    </div>
  }

  return null;

}

export default () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("none");
  const [repassword, setrePassword] = useState("");
  const [clientUsername, setClientUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [alertContent, setAlertContent] = useState<{ title?: string, description?: string, type?: string }>({})
  const [isAccessSubmitting, setIsAccessSubmitting] = useState(false);
  const [isSslSubmitting, setIsSslSubmitting] = useState(false);
  const [ca, setCa] = useState<any>();
  const [pk, setPk] = useState<any>();
  const [sslStatus, setSslStatus] = useState("");


  const handleUpdateCredential = async (e: any) => {
    e.preventDefault();

    if (password.trim() && repassword.trim()) {

      setIsAccessSubmitting(true);

      let { data } = await api.post("/updateClient", {
        username,
        password
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("client_token")}`
        }
      })


      if (data.message === "Done") {
        setAlertContent({
          type: "success",
          title: "Client updated successfully",
          description: data.details
        })
      } else {
        setAlertContent({
          type: "error",
          title: "Error updaring client",
          description: data.details
        })
      }

      setIsAccessSubmitting(false);
    }

  }

  const handleGetSslStatus = async () => {

    let { data } = await apiClient.get("/getSslStatus");

    if (data.message === "Done") setSslStatus(data.details);

  }

  const handleUpdateSsl = async (e: any) => {

    setIsSslSubmitting(true)

    e.preventDefault();

    const formData = new FormData();

    formData.append("ca", ca);
    formData.append("pk", pk);

    let { data } = await apiClient.post("/uploadSsl", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (data.message === "Done") {
      setAlertContent({
        type: "success",
        title: "SSL Updated",
        description: data.details
      })
    } else {
      setAlertContent({
        type: "error",
        title: "Updating SSL error",
        description: data.details
      })
    }

    handleGetSslStatus();
    setIsSslSubmitting(false)

  }

  const getClient = async (token: string) => {

    try {

      let { data } = await api.post("/getClient", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (data.message === "Done") {
        setClientUsername(data.details.username);
        setUsername(data.details.username);
        setStatus("valid");
      } else {
        setStatus("none");
      }

    } catch (error: any) {

      setStatus("none");

    }

  }

  const handleSignOut = () => {
    localStorage.removeItem("client_token");
    location.reload();
  }

  useEffect(() => {

    const token = localStorage.getItem("client_token");

    if (token?.split("")) getClient(token);

    handleGetSslStatus();

  }, []);

  return <div className="h-full bg-slate-100 px-10 lg:px-28 md:px-20 sm:px-10 xl:px-24 pt-20">
    {
      alertContent && Object.keys(alertContent).length
        ? <AlertIndex title={alertContent.title as string} content={alertContent.description as string} type={alertContent.type as string} handleClose={() => {
          setAlertContent({})
        }} />
        : null
    }

    {
      status === "valid"
        ? <>
          <div className="bg-slate-50 border rounded-sm shadow-md flex w-full mb-4 items-center p-3 px-4">
            <h1 className="text-lg w-full">Client Settings</h1>
            <button onClick={handleSignOut}>
              <FontAwesomeIcon icon={faSignOut} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-x-3 items-start">
            <div className="border rounded-sm bg-slate-50 p-3 px-4 shadow-md">

              {
                !isAccessSubmitting
                  ?
                  <>
                    <h1 className="mb-3">Access Credential</h1>
                    <form onSubmit={handleUpdateCredential}>
                      <InputIndex placeholder="juandelacruz07" label="Username" type="text" handler={(e: any) => setUsername(e.target.value)} value={username} icon={<FontAwesomeIcon icon={faUser} />} />
                      <div className="mb-2"></div>
                      <InputIndex label="Password" type={`${showPass ? 'text' : 'password'}`} handler={(e: any) => setPassword(e.target.value)} value={password} icon={<FontAwesomeIcon icon={faKey} />} />
                      {
                        password.trim() && repassword.trim()
                          ?
                          password === repassword
                            ? null
                            : <small className="text-red-600">Not Matched!</small>
                          : null
                      }
                      <div className="mb-3"></div>
                      <InputIndex label="Re-Password" type={`${showPass ? 'text' : 'password'}`} handler={(e: any) => setrePassword(e.target.value)} value={repassword} icon={<FontAwesomeIcon icon={faKey} />} />
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

                      <div className="flex justify-end">
                        <button className="text-sm border rounded-sm bg-white py-2 px-3">Save</button>
                      </div>
                    </form>
                  </>
                  : <div className="text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>
              }

            </div>
            <div className="col-span-3 border rounded-sm bg-slate-50 p-3 px-4 shadow-md">

              {
                !isSslSubmitting
                  ? <>
                    <h1>SSL Certificates <span className={`font-light text-xs p-1 px-3 rounded-sm ${sslStatus === 'INITIAL' ? 'bg-orange-600 text-white' : null} ${sslStatus === 'READY' ? 'bg-green-600 text-white' : null} ${sslStatus === 'RESTART' ? 'bg-red-600 text-white' : null}`}>
                      {
                        sslStatus === "INITIAL" ? 'SSL DEFAULT USED' : null
                      }
                      {
                        sslStatus === "READY" ? 'SSL WORKING' : null
                      }
                      {
                        sslStatus === "RESTART" ? 'SSL NEEDS RELOAD' : null
                      }
                    </span></h1>
                    <small className="mb-3 block font-light">
                      {
                        sslStatus === 'INITIAL' ? 'The current SSL running is the default. Upload new one by uploading new SSL certificates below.' : null
                      }
                      {
                        sslStatus === 'RESTART' ? 'New SSL certificates have been uploaded. Please restart the client and client-handler servers to take effect.' : null
                      }
                    </small>
                    <form onSubmit={handleUpdateSsl}>
                      <label className="text-sm mb-2 block">Certificate Authority (CA)</label>
                      <input onChange={(e) => {
                        setCa(e.target.files?.item(0))
                      }} type="file" className="border rounded-sm font-light w-full bg-white text-sm p-3 px-4" />
                      <div className="mb-2"></div>
                      <label className="text-sm mb-2 block">Private Key</label>
                      <input onChange={(e) => {
                        setPk(e.target.files?.item(0))
                      }} type="file" className="border rounded-sm font-light w-full bg-white text-sm p-3 px-4" />
                      <div className="mb-3"></div>

                      <div className="flex justify-end">
                        <button className="text-sm border rounded-sm bg-white py-2 px-3">Save</button>
                      </div>
                    </form>
                  </>
                  : <div className="text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin" /></div>
              }

            </div>
          </div>

        </>
        : status === "checking"
          ? <div className="flex items-center justify-center flex-col">
            <span className="block mb-2">Checking Session</span>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
          </div>
          : <SignInClient />
    }


  </div>

}