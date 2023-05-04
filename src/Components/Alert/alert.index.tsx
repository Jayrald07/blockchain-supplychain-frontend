import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonIndex from "../Button/button.index";
import "./alert.index.css";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { MouseEventHandler, useEffect } from "react";
export default ({
  content,
  title,
  type,
  handleClose,
}: {
  content: string;
  title: string,
  type: string,
  handleClose: any;
}) => {

  const theme = {
    bg: type === "error" ? "bg-red-100" : "bg-green-100",
    text: type === "error" ? "text-red-600" : "text-green-600",
  }

  useEffect(() => {
    setTimeout(() => {
      handleClose();
    }, 4000);
  }, []);

  return (
    <div className="absolute flex justify-center w-full top-0 left-0">
      <div className={`rounded py-5 px-8 mt-3 shadow-md z-50 ${theme.bg} relative w-72`}>
        <a onClick={handleClose} href="#" role="button" className={`absolute top-2 right-3 text-sm ${theme.text}`}>
          <FontAwesomeIcon icon={faClose} />
        </a>
        <h1 className={`text-sm ${theme.text}`}>{title || "Error"}</h1>
        <p className={`text-sm font-extralight ${theme.text}`}>
          {content}
        </p>
      </div>
    </div>
  );
};
