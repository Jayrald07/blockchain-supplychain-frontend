import "./register-card.index.css";

type InputProps = {
  type: string;
  label: string;
  placeholder?: string;

};

export default ({ type, label, placeholder }: InputProps) => {
  return (
    <section >
      <label>{label}</label>
      <div className="input-container">
        <input type={type} placeholder={placeholder} />
      </div>
    </section>
  );
};
