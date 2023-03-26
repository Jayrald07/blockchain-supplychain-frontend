import React, { MouseEventHandler, ReactNode } from "react";
import "./button.index.css";

type Button = {
  label: string;
  icon?: ReactNode;
  handleClick?: MouseEventHandler;
};

export default ({ label, icon, handleClick = () => { } }: Button) => {
  return (
    <section className="flex justify-end">
      <button onClick={handleClick} className="border py-2 px-3 text-sm rounded hover:bg-slate-200">
        {icon} {label}
      </button>
    </section>
  );
};
