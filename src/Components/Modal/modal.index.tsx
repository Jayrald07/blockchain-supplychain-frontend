import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./modal.index.css";
export default () => {
  return (
    <section className="bsc-modal">
      <div className="bsc-modal-box">
        <div className="bsc-modal-header">
          <h1>New Asset</h1>
          <button>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <div className="bsc-modal-content"></div>
        <div className="bsc-modal-footer"></div>
      </div>
    </section>
  );
};
