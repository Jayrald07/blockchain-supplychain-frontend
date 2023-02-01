import "./textarea.index.css";

type TextArea = {
  label: string;
  handler?: any;
  value: string;
  disabled?: boolean;
};

export default ({ label, handler, value, disabled = false }: TextArea) => {
  return (
    <div className="textarea-container">
      <label>{label}</label>
      <textarea
        disabled={disabled}
        value={value}
        onChange={handler}
        rows={5}
      ></textarea>
    </div>
  );
};
