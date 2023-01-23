import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputIndex from "../Input/input.index";
import "./asset.index.css";
import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";

export default () => {
  return (
    <main className="bsc-asset">
      <h1>Assets</h1>
      <section>
        <InputIndex
          icon={<FontAwesomeIcon icon={faChevronDown} />}
          label="Organization Name"
          placeholder=""
          type="text"
        />
        <ul>
          <li>
            <a href="#">Assets</a>
          </li>
          <li>
            <a href="#">Transfers</a>
          </li>
          <li>
            <a href="#">View Transactions</a>
          </li>
        </ul>
        <InputIndex
          icon={<FontAwesomeIcon icon={faSearch} />}
          label="Search Asset"
          placeholder=""
          type="text"
        />
      </section>
      <section></section>
    </main>
  );
};
