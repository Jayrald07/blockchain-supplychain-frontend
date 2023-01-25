import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputIndex from "../Input/input.index";
import "./asset.index.css";
import {
  faChevronDown,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Table from "../Table/table.index";

export default () => {
  return (
    <main className="bsc-asset">
      <h1>Manage Assets</h1>
      <section>
        <InputIndex
          icon={<FontAwesomeIcon icon={faChevronDown} />}
          label="Organization Name"
          placeholder=""
          type="text"
        />
        <InputIndex
          icon={<FontAwesomeIcon icon={faSearch} />}
          label="Search Asset"
          placeholder=""
          type="text"
        />
        <span></span>
        <button>
          <span>Create New Asset</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </section>
      <Table
        rows={[
          {
            id: "0001",
            name: "Item 1",
            organization: "Organization 1",
          },
          {
            id: "0002",
            name: "Item 2",
            organization: "Organization 1",
          },
          {
            id: "0003",
            name: "Item 3",
            organization: "Organization 1",
          },
        ]}
      />
    </main>
  );
};
