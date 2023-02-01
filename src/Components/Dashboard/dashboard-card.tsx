import "./dashboard-card.css";

type Button = {
  label1: string;
  label2: string | number;
  icon?: React.ReactNode;
};

export default ({ label1, label2, icon }: Button) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-icon">{icon}</div>
      <div className="dashboard-content">
        <div className="small-text">
          <label>{label1}</label>
        </div>
        <div className="big-text">
          <label>{label2}</label>
        </div>
      </div>
    </div>
  );
};
