import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./modal.index.css";
import InputIndex from "../Input/input.index";
export default ({
  Component,
  handleClose,
  assetId,
  action,
  channelId
}: {
  Component: any;
  handleClose: any;
  assetId: string;
  action: string;
  channelId: string
}) => {
  return (
    <section
      className="absolute top-0 left-0 w-full justify-center bg-slate-500 h-full flex items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      onClick={(e) => {
        handleClose();
      }}
    >
      <div
        className="w-2/4 bg-white rounded border shadow-md"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="border-b flex py-3 px-3.5">
          <h1 className="w-full">
            {action === "view" ? "View Asset" : null}
            {action === "update" ? "Update Asset" : null}
            {action === "" ? "New Asset" : null}
          </h1>
          <button onClick={handleClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="py-3 px-5">
          <Component
            handleClose={handleClose}
            assetId={assetId}
            action={action}
            channelId={channelId}
          />
        </div>
        <div className="bsc-modal-footer"></div>
      </div>
    </section>
  );
};
