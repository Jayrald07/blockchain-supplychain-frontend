import React, { MouseEventHandler, ReactNode } from "react";
import "./button.index.css";

type Button = {
  label: string;
  icon?: ReactNode;
  handleClick?: MouseEventHandler;
};

export default ({ label, icon, handleClick = () => {} }: Button) => {
  return (
    <section className="button-container">
      <button onClick={handleClick}>
        {icon} {label}
      </button>
    </section>
  );
};
