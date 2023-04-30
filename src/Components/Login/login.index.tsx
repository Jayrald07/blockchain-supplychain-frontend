import React, { useEffect, useState } from "react";
import Button from "../Button/button.index";
import Card from "../Card/card.index";
import Form from "../Form/form.index";
import "./login.index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useLocalstorageValidation from "../../hooks/useLocalstoragevalidation";
import Logo from "../../assets/logo.png"
import AlertIndex from "../Alert/alert.index";

export default () => {

  const isCurrentLogin = useLocalstorageValidation();
  const [isModal, setIsModal] = useState(false)
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");

  const handleResponse = (data: any) => {
    console.log(data)
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
        <div className="w-full h-full flex justify-center items-center flex-col bg-slate-100">
          <img src={Logo} className="w-52 mb-10" />
          <div className="self-center bg-white border border-slate-200 rounded p-5 shadow-md">
            <Form handleResponse={handleResponse}>
              <Button label="Login" icon={<FontAwesomeIcon icon={faSignIn} />} />
            </Form>
            <section className="flex flex-col items-end text-xs font-light">
              <label className="font-normal">Haven't connected your server yet?</label>
              <a href="/register" className="underline hover:no-underline">Connect it here</a>
            </section>
          </div>
        </div>
      </>
    );
  } else return null

};
