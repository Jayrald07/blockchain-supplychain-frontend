type Button = {
  label: string;
  icon?: React.ReactNode;
};

export default ({ label, icon }: Button) => {
  return (
    <>
      <div style={{ width: "200px" }} id="qr-scanner"></div>
      <div className="qr-container">
        <div className="qr-icon">{icon}</div>
        <div className="qr-content">
          <label>{label}</label>
        </div>
      </div>
    </>
  );
};
