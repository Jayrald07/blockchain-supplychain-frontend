import { useEffect, useState } from "react";
import ButtonIndex from "../Button/button.index";
import Input from "../Input/input.index";
import axios from "axios";
import { host, port } from "../../utilities";
import Alert from "../Alert/alert.index";
import useSocket from "../../hooks/useSocket";
import InputIndex from "../Input/input.index";
import PromptIndex from "../Prompt/prompt.index";
import { HttpMethod, api as globalApi } from "../../services/http";
import cryptoRandomString from "crypto-random-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const api = axios.create({ baseURL: `${host}:${port}` });

const NodeByUser = ({ back }: any) => {
  const [step, setStep] = useState(0);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [orgId, setOrgId] = useState("");
  const [alert, setAlert] = useState<null | { title: string, message: string, type: string }>(null)

  const listSteps = [
    <div className="w-80 mb-3 block">
      <ol className="list list-decimal text-sm font-light pl-4 space-y-2">
        <li>
          Install the <a href="https://chaindirect.s3.us-east-1.amazonaws.com/chaindirect.sh" download="chaindirect.sh" className="underline hover:no-underline">script</a> on you machine
        </li>
        <li>
          Run the script like shown below. Make sure you are using Ubuntu or WSL
          with Ubuntu
        </li>
        <li>
          Once the script already ran, go to your server URL:<br />
          Example: http://IP-ADDRESS:8012
        </li>
        <li>
          Fill out the form, and click "Done". The creation of node will proceed,
          and will take about 1 to 2 minutes.
        </li>
        <li>Once done, there will be instructions shown on the page.</li>
        <li>
          Lastly, input the ID in the textbox below.
          <Input
            type="text"
            value={id}
            label=""
            placeholder="xxxx-xxxx-xxxx-xxxx"
            handler={(e: any) => setId(e.target.value)}
          />
        </li>
      </ol>
    </div>
    ,
    <>
      <small className="font-light text-xs block mb-3">Associated ID: {id}</small>

      <Input
        label="Username"
        type="text"
        placeholder="Juan Dela Cruz"
        handler={(e: any) => setUsername(e.target.value)}
        value={username}
      />
      <Input
        label="Password"
        type="password"
        handler={(e: any) => setPassword(e.target.value)}
        value={password}
      />
    </>,
    <div className="w-80">
      <small className="font-light text-xs block mb-3">
        Kindly input your node's IP Address and port. The system will check if
        there is connection.
      </small>
      <Input
        label="IP Address"
        type="text"
        placeholder="Ex. 192.168.1.1"
        handler={(e: any) => setIp(e.target.value)}
        value={ip}
      />
      <Input
        label="Port"
        type="Port"
        placeholder="Ex. 8012"
        handler={(e: any) => setPort(e.target.value)}
        value={port}
      />
    </div>,
    <div className="w-80 mt-4 text-sm font-light mb-6">
      <h3 className="mb-2 font-normal">Node Registered!</h3>
      <p className="mb-2">You server/node is successfully connected with the web app. You can now interact with other organizations</p>

      <p>
        This page will redirect to login page in 20 seconds.
        Click <a href="/login" className="underline hover:no-underline">here</a> for manual redirection
      </p>
    </div>,
  ];

  const move = (val: number) => {
    if (val == -1) back();
    else setStep(val);
  };

  const checkID = async () => {
    if (id.trim()) {
      const { data } = await api.post("/validateID", { identifier: id });
      if (data.message != "Done") setAlert({ title: "Credential Error", message: data.message, type: "error" })
      else move(step + 1);
    }
  };

  const checkAssociate = async () => {
    const { data } = await api.post("/validateAssociation", {
      username,
      password,
      identifier: id,
    });

    if (data.message === "Done" && data.details.status === "valid") {
      setOrgId(data.details.id);
      move(step + 1);
    } else setAlert({ title: "Credential Error", message: data.details, type: "error" })
  };

  const checkHost = async () => {
    try {
      const { data } = await api.post(`/createConnection`, {
        ip,
        port,
        organization_id: orgId,
      });
      if (data.message === "Done") {
        move(step + 1);
        setTimeout(() => { location.href = "/login" }, 20000);
      } else setAlert({ title: "Connection Error", message: data.details, type: "error" })
    } catch (error: any) {
      setAlert({ title: "Connection Error", message: error.details, type: "error" })
    }
  };

  const next: any = () => {
    switch (step) {
      case 0:
        return checkID;
      case 1:
        return checkAssociate;
      case 2:
        return checkHost;
    }
  };

  useEffect(() => { }, [step]);

  return (
    <div>
      {
        alert && (
          <Alert type={alert.type} content={alert.message} title={alert.title} handleClose={() => setAlert(null)} />
        )
      }

      {listSteps[step]}
      {step < 3 ? (
        <div className="flex justify-end gap-x-2">
          <ButtonIndex label="Back" handleClick={() => move(step - 1)} />
          <ButtonIndex label="Next" handleClick={next()} />
        </div>
      ) : null}
    </div>
  );
};

const NodeBySystem = ({ back }: any) => {
  let tempToken = cryptoRandomString({ length: 10 });

  const socket = useSocket(`${host}:${port}`, tempToken);
  const [pkey, setPkey] = useState("");
  const [chain, setChain] = useState("");
  const [pkeyname, setPkeyname] = useState("");
  const [orgType, setOrgType] = useState("supplier");
  const [promptContent, setPromptContent] = useState<{ question?: string, description?: string, buttons?: string[] }>({})
  const [submit, setSubmit] = useState(false);
  const [responses, setResponses] = useState<{}[]>([])
  const [finalData, setFinalData] = useState<{ ip?: string, pkey?: string, username?: string }>({});
  const navigate = useNavigate();

  const handleResponse = async (response: string) => {
    if (response === 'Yes') {

      setSubmit(true);

      const response = await globalApi("/createNode", HttpMethod.POST, {
        tempToken,
        idName: orgType,
        pkeyname,
        pk: btoa(pkey),
        fc: btoa(chain)
      })

    } else {
      setPromptContent({});
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("vm", (data) => {
        setResponses((prevResponses) => {
          let _r = [...prevResponses, { content: data.details, end: data.end }];
          if (data.message === "Done" && data.end) {
            setFinalData({
              ip: data.ip,
              pkey: data.pkey,
              username: data.username
            })
          }
          return _r;
        })
      })
    }
  }, [socket]);

  if (submit) {

    return <div className="">
      {
        finalData && Object.keys(finalData).length
          ? null
          : <>
            <small className="font-light block mb-3">Please don't refresh or leave the tab while processing</small>
            <ul>
              {
                responses.map((item: any, index: number) => {
                  return <li className="text-xs font-light flex items-center py-2 border bg-slate-100 px-2 mb-2">
                    <span className="mr-3">{item.content}</span>
                    {
                      !item.end && responses.length - 1 === index
                        ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" />
                        : <FontAwesomeIcon icon={faCheckCircle} size="sm" className="text-green-500" />
                    }
                  </li>
                })
              }
            </ul>
          </>
      }
      {
        finalData && Object.keys(finalData).length
          ? <div>
            <small className="font-light block mb-3">Server creation done!</small>
            <small className="font-light block mb-3">Please save the information below.</small>
            <table className="w-full whitespace-nowrap border-slate-100 mb-3">
              <tbody className="text-sm font-thin">
                <tr className="bg-slate-100">
                  <td className="font-bold p-2 text-slate-800 bg-slate-200">Username</td>
                  <td className="p-2 text-center">{finalData.username}</td>
                </tr>
                <tr className="bg-slate-100">
                  <td className="font-bold p-2 text-slate-800 bg-slate-200">IP Address</td>
                  <td className="p-2 text-center">{finalData.ip}</td>
                </tr>
              </tbody>
            </table>
            <label className="block text-sm mb-2">SSH Key</label>
            <textarea value={finalData.pkey} className="w-full border outline-none mb-3 overflow-x-auto whitespace-nowrap font-light text-xs p-2" rows={12}>

            </textarea>
            <div className="flex justify-end">
              <button className="border rounded text-sm py-1 px-2" onClick={() => navigate("/login")}>Back to Login</button>
            </div>
          </div>
          : null
      }
    </div>

  }

  return <div>
    {
      promptContent && Object.keys(promptContent).length
        ? <PromptIndex question={promptContent.question as string} description={promptContent.description as string} buttons={promptContent.buttons as string[]} onClose={() => {
          setPromptContent({})
        }} handleClick={handleResponse} /> : null
    }
    <small className="font-light block mb-3">Please fill out all the fields.</small>
    <form onSubmit={(e) => {
      e.preventDefault();
      setPromptContent({
        question: "Are you sure to proceed?",
        description: "Once started it cannot be stopped. Please double check your inputs",
        buttons: ['Yes', 'No']
      })
    }}>
      <InputIndex type="text" label="Private key name" value={pkeyname} handler={(e: any) => setPkeyname(e.target.value)} />
      <label className="block text-sm mb-2">Organization Type</label>
      <select value={orgType} required className="bg-white p-2 outline-none border w-full text-sm mb-3" onChange={(e) => setOrgType(e.target.value)}>
        <option value="supplier">Supplier</option>
        <option value="manufacturer">Manufacturer</option>
        <option value="distributor">Distributor</option>
        <option value="retailer">Retailer</option>
      </select>

      <label className="block text-sm mb-2">Chainkey Certificate</label>
      <textarea placeholder="-----BEGIN CERTIFICATE ----- ..." value={chain} onChange={(e) => setChain(e.target.value)} className="w-full border outline-none mb-3 overflow-x-auto whitespace-nowrap font-light text-xs p-2" rows={5}>

      </textarea>

      <label className="block text-sm mb-2">Private Key Certificate</label>
      <textarea placeholder="-----BEGIN RSA PRIVATE KEY----- ..." value={pkey} onChange={(e) => setPkey(e.target.value)} className="w-full border outline-none overflow-x-auto whitespace-nowrap mb-3 font-light text-xs p-2" rows={5}>

      </textarea>
      <div className="flex justify-end">
        <button className="border rounded text-sm py-1 px-2 mr-2" onClick={back}>Back</button>
        <button className="border rounded text-sm py-1 px-2">Create</button>
      </div>
    </form>
  </div>

}

export default () => {
  const [provideNode, setProvideNode] = useState(-1);

  return (
    <>
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className={`bg-white p-5 border border-slate-200 rounded shadow-md ${provideNode === 0 ? 'w-1/2' : ''}`}>
          <h1 className="mb-1">Register</h1>
          {provideNode == -1 ? (
            <div>
              <small className="mb-3 block font-light">
                Select option below on how you wanted to create your node
              </small>
              <div className="grid font-extralight text-sm gap-3 mb-4">
                <a role="button" className="border py-2 px-3 rounded hover:bg-slate-100"
                  onClick={() => {
                    setProvideNode(0);
                  }}
                >Provide node by webapp</a>
                <a
                  role="button"
                  onClick={() => {
                    setProvideNode(1);
                  }}
                  className="border py-2 px-3 rounded hover:bg-slate-100"
                >
                  Provide node by me
                </a>
              </div>
              <div className="grid justify-end text-end text-xs font-light">
                <span className="font-normal">
                  Already connected?
                </span>
                <a href="/login" className="underline hover:no-underline">Login Instead</a>
              </div>
            </div>
          ) : null}

          {provideNode > -1 ? (
            provideNode == 0 ? <NodeBySystem back={() => setProvideNode(-1)} /> : (
              <NodeByUser back={() => setProvideNode(-1)} />
            )
          ) : null}
        </div>
      </div>
    </>
  );
};
