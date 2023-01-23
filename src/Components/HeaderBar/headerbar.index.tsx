import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import "./headerbar.index.css";

export default () => {
  return (
    <header className="bsc-header">
      <ul>
        <li>
          <a href="#">
            <FontAwesomeIcon icon={faBell} />
          </a>
        </li>
        <li>
          <a href="#">
            <FontAwesomeIcon icon={faUser} />
          </a>
        </li>
      </ul>
    </header>
  );
};
