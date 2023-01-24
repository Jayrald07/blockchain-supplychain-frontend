import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxesStacked, faQrcode } from "@fortawesome/free-solid-svg-icons";
import QR from "./Components/QR/qr";
import "./Components/QR/qr-scan.css";
import Dashboard from "./Components/Dashboard/dashboard-card";
import "./Components/Dashboard/dashboard-card.css";


  
  export default () => {
    return <Dashboard label1="Number of transactions" label2="4" icon={<FontAwesomeIcon icon={faBoxesStacked} />} />
  };
  //<QR label="Scan item's QR code" icon={<FontAwesomeIcon icon={faQrcode} />} />