import React, { MouseEventHandler, ReactNode } from "react";
import "./button.index.css";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Button = {
  label?: string;
  Icon?: ReactNode;
  handleClick?: MouseEventHandler;
};

export default ({ label, Icon, handleClick = () => { } }: Button) => {
  return (
    <section className="flex justify-end">
      <button onClick={handleClick} className="border py-2 px-3 text-sm rounded hover:bg-slate-200">
        {Icon}
        {label}
      </button>
    </section>
  );
};
