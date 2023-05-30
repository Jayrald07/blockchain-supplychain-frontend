import "./input.index.css";

type InputProps = {
  type: string;
  label: string;
  placeholder?: string;
  icon?: React.ReactNode;
  handler: React.ChangeEventHandler;
  value: string;
  disabled?: boolean;
  description?: string
};

export default ({
  type,
  label,
  placeholder,
  icon,
  handler,
  value = "",
  disabled = false,
  description = ""
}: InputProps) => {
  return (
    <section>
      <div className="mb-2">
        <label className="text-sm block">{label}</label>
        <small className="font-light">{description}</small>
      </div>
      <div className="border flex flex-item">
        {icon && <div className="w-10 flex items-center justify-center bg-slate-200 text-slate-600">{icon}</div>}

        <input
          required
          disabled={disabled}
          type={type}
          placeholder={placeholder}
          onChange={handler}
          value={value}
          className="outline-none font-thin py-2 px-3 text-sm w-full"
        />
      </div>
    </section>
  );
};
