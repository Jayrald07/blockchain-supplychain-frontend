import React from "react";
import "./table.index.css";

type Row = {
  id: string;
  name: string;
  organization: string;
};

export default ({ rows }: { rows: Row[] }) => {
  return (
    <section className="bsc-table">
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Organization</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            return (
              <tr>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.organization}</td>
                <td>
                  <button>View</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
