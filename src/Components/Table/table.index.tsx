import React from "react";
import "./table.index.css";

type Row = {
  id: string;
  name: string;
  organization: string;
};

export default ({
  rows,
  handleView,
  handleUpdate,
  handleRemove,
}: {
  rows: Row[];
  handleView?: any;
  handleUpdate?: any;
  handleRemove?: any;
}) => {
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
          {rows?.map((item: any) => {
            return (
              <tr key={item.asset_uuid}>
                <td>{item.asset_uuid}</td>
                <td>{item.asset_name}</td>
                <td>Jayralds</td>
                <td>
                  <button onClick={() => handleView(item._id)}>View</button>
                  <button onClick={() => handleUpdate(item._id)}>Update</button>
                  <button onClick={() => handleRemove(item._id)}>Remove</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
