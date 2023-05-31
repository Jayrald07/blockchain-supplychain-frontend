import React, { useEffect, useState } from "react";
import Button from "../Button/button.index";
import Card from "../Card/card.index";
import Form from "../Form/form.index";
import "./login.index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faList, faQrcode, faSignIn, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useLocalstorageValidation from "../../hooks/useLocalstoragevalidation";
import Logo from "../../assets/logo.png"
import AlertIndex from "../Alert/alert.index";
import { useNavigate } from "react-router-dom";

export default () => {

  const isCurrentLogin = useLocalstorageValidation();
  const [isModal, setIsModal] = useState(false)
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const navigate = useNavigate();

  const handleResponse = (data: any) => {
    if (data.message === "Error") {
      setIsModal(true);
      setAlertTitle("Credential Error");
      setAlertContent(data.details);
    }

  }

  useEffect(() => {
    if (isCurrentLogin === "valid") location.href = "/dashboard";
  }, [isCurrentLogin]);

  if (isCurrentLogin === "invalid" || isCurrentLogin === "validating") {
    return (
      <>
        {
          isModal &&
          <AlertIndex type="error" content={alertContent} title={alertTitle} handleClose={() => setIsModal(!isModal)} />
        }
        <div className="flex justify-end bg-slate-100 gap-x-3 p-3 text-xs absolute w-full items-center">
          {/* <span className="font-light"><b>Access Code:</b> ac9505fb-00b2-4b96-b089-d2b71ee43440</span> */}
          {/* <a className="border rounded-sm py-2 px-3 bg-white" href="/global-transactions"> */}
          {/* <FontAwesomeIcon icon={faList} className="pr-1" /> <span>Transactions</span></a> */}
          <a className="border rounded-sm py-2 px-3 bg-white" href="/client-settings">
            <FontAwesomeIcon icon={faGear} className="pr-1" /> <span>Settings</span>
          </a>
        </div>
        <div className="w-full h-full flex justify-center items-center flex-col bg-slate-100">
          <img src={Logo} className="w-52 mb-10" />
          <div className="self-center bg-white border border-slate-200 rounded p-5 shadow-md mb-3">
            <Form handleResponse={handleResponse}>
              <Button label="Login" Icon={<FontAwesomeIcon icon={faSignIn} className="mr-2" />} />
            </Form>
            <section className="flex flex-col items-end text-xs font-light">
              <label className="font-normal">Haven't connected your server yet?</label>
              <a href="/register" className="underline hover:no-underline">Connect it here</a>
            </section>
          </div>
          <div onClick={() => {
            navigate("/scan")
          }} className="bg-white border border-slate-200 rounded p-5 shadow-md flex items-center cursor-pointer">
            <FontAwesomeIcon icon={faQrcode} />
            <h1 className="text-sm ml-3">Scan QR</h1>
          </div>
        </div>
      </>
    );
  } else return null

};
