import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import "./headerbar.index.css";
import Statusbar from "../StatusBar/statusbar.index";

export default () => {
  return (
    <header className="border-b grid grid-cols-2">
      <Statusbar />
      <ul className="flex justify-end text-slate-700">
        <li>
          <a href="#" className="p-5 px-6 block hover:bg-gray-100 ">
            <FontAwesomeIcon icon={faBell} />
          </a>
        </li>
        <li>
          <a href="/account" className="p-5 px-6 block hover:bg-gray-100">
            <FontAwesomeIcon icon={faUser} />
          </a>
        </li>
        <li>
          <a className="p-5 block hover:bg-gray-100" href="/logout">
            <FontAwesomeIcon icon={faSignOut} />
          </a>
        </li>
      </ul>
    </header>
  );
};
