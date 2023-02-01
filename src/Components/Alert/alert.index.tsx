import ButtonIndex from "../Button/button.index";
import "./alert.index.css";
export default ({
  content,
  handleOk,
  handleCancel,
}: {
  content: string;
  handleOk: any;
  handleCancel: any;
}) => {
  return (
    <div className="alert-container">
      <div className="alert-box">
        <p>{content}</p>
        <div>
          <ButtonIndex label="Ok" handleClick={handleOk} />
          <ButtonIndex label="Cancel" handleClick={handleCancel} />
        </div>
      </div>
    </div>
  );
};
