import { useEffect, useState } from "react";
import ButtonIndex from "../Button/button.index";
import Input from "../Input/input.index";
import axios from "axios";
import { host, port } from "../../utilities";
import Alert from "../Alert/alert.index";


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
          Install the <a href="#" className="underline hover:no-underline">script</a> on you machine
        </li>
        <li>
          Run the script like shown below. Make sure you are using Ubuntu or WSL
          with Ubuntu
        </li>
        <li>
          Once the script already ran, goto the setup page with this URL:
          http://localhost:5173
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
      console.log(data);
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

export default () => {
  const [provideNode, setProvideNode] = useState(-1);

  return (
    <>
      <div className="flex items-center justify-center h-full bg-slate-100">
        <div className="bg-white p-5 border border-slate-200 rounded shadow-md">
          <h1 className="mb-1">Register</h1>
          {provideNode == -1 ? (
            <div>
              <small className="mb-3 block font-light">
                Select option below on how you wanted to create your node
              </small>
              <div className="grid font-extralight text-sm gap-3 mb-4">
                <a role="button" className="border py-2 px-3 rounded hover:bg-slate-100">Provide node by webapp</a>
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
            provideNode == 0 ? null : (
              <NodeByUser back={() => setProvideNode(-1)} />
            )
          ) : null}
        </div>
      </div>
    </>
  );
};
