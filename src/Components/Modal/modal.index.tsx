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
}: {
  Component: any;
  handleClose: any;
  assetId: string;
  action: string;
}) => {
  return (
    <section
      className="bsc-modal"
      onClick={(e) => {
        handleClose();
      }}
    >
      <div
        className="bsc-modal-box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="bsc-modal-header">
          <h1>
            {action === "view" ? "View Asset" : null}
            {action === "update" ? "Update Asset" : null}
            {action === "" ? "New Asset" : null}
          </h1>
          <button onClick={handleClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="bsc-modal-content">
          <Component
            handleClose={handleClose}
            assetId={assetId}
            action={action}
          />
        </div>
        <div className="bsc-modal-footer"></div>
      </div>
    </section>
  );
};
