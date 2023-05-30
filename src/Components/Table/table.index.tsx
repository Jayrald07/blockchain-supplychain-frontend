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
  handleCheck,
  handleRemove,
  handleMove,
  handleCopy,
  handleHistory
}: {
  rows: Row[];
  handleView?: any;
  handleUpdate?: any;
  handleRemove?: any;
  handleCheck?: any;
  handleMove?: any;
  handleCopy?: any;
  handleHistory?: any
}) => {
  return (
    <section className="w-full overflow-x-auto">
      <table className="w-full border border-slate-100 whitespace-nowrap">
        <thead className="bg-slate-100 text-sm text-slate-600 text-left">
          <tr>
            <th className="p-2"></th>
            <th className="p-2">Origin</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-sm font-thin">
          {
            !rows.length
              ? <tr className="hover:bg-slate-50 border-b border-b-slate-100">
                <td className="p-2 text-center" colSpan={5}>No Assets</td>
              </tr> : null
          }
          {rows?.map((item: any) => {
            return (
              <tr key={item.asset_uuid} className="hover:bg-slate-50 border-b-slate-100">
                <td className="py-2 px-2 flex justify-center items-center"><input type="checkbox" onChange={e => {
                  handleCheck(item.asset_uuid, e.target.checked)
                  handleMove(item.asset_uuid, false, e.target.checked)
                  handleCopy(item.asset_uuid, false, e.target.checked)
                }} /></td>
                <td className="py-2 px-2">{(item.origin?.organization_display_name ? item.origin?.organization_display_name : item.origin?.organization_name) ?? "-"}</td>
                <td>{item.asset_name}</td>
                <td>
                  <button className="pr-2" onClick={() => handleView(item._id)}>View</button>
                  <button className="pr-2" onClick={() => handleUpdate(item._id)}>Update</button>
                  <button className="pr-2" onClick={() => handleRemove(item._id)}>Remove</button>
                  <button className="pr-2" onClick={() => handleMove(item.asset_uuid, true, true)}>Move</button>
                  <button className="pr-2" onClick={() => handleCopy(item.asset_uuid, true, true)}>Copy</button>
                  <button className="pr-2" onClick={() => handleHistory(item.asset_uuid, true, true)}>History</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
