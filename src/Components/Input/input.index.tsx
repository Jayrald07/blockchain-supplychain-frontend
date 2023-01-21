import "./input.index.css";

type InputProps = {
  type: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
};

export default ({ type, label, placeholder, icon }: InputProps) => {
  return (
    <section className="bsc-input">
      <label>{label}</label>
      <div className="input-container">
        <div className="input-icon">{icon}</div>
        <input type={type} placeholder={placeholder} />
      </div>
    </section>
  );
};
