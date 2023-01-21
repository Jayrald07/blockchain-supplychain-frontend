import React, { ReactNode } from "react";
import "./button.index.css";

type Button = {
  label: string;
  icon?: ReactNode;
};

export default ({ label, icon }: Button) => {
  return (
    <section className="button-container">
      <button>
        {icon} {label}
      </button>
    </section>
  );
};
