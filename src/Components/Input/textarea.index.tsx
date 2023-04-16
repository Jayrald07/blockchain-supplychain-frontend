import "./textarea.index.css";

type TextArea = {
  label: string;
  handler?: any;
  value: string;
  disabled?: boolean;
};

export default ({ label, handler, value, disabled = false }: TextArea) => {
  return (
    <div className="grid">
      <label className="text-sm mb-2 block">{label}</label>
      <textarea
        className="outline-none font-thin py-2 px-3 text-sm w-full border mb-3"
        disabled={disabled}
        value={value}
        onChange={handler}
        rows={5}
      ></textarea>
    </div>
  );
};
