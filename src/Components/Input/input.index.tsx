import "./input.index.css";

type InputProps = {
  type: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  handler: React.ChangeEventHandler;
  value: string;
  disabled?: boolean;
};

export default ({
  type,
  label,
  placeholder,
  icon,
  handler,
  value = "",
  disabled = false,
}: InputProps) => {
  return (
    <section className="bsc-input">
      <label>{label}</label>
      <div className="input-container">
        {icon && <div className="input-icon">{icon}</div>}

        <input
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          onChange={handler}
          value={value}
        />
      </div>
    </section>
  );
};
