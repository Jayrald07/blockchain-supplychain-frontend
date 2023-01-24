import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import QR from "./Components/QR/qr";
import "./Components/QR/qr-scan.css";


  
  export default () => {
    return <QR label="Scan item's QR code" icon={<FontAwesomeIcon icon={faQrcode} />} />
  };
  