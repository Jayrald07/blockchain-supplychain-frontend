import "./provenance.index.css";
import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default () => {
  return (
    <section className="provenance-container">
      <div className="provenance-logo">
        <img src={Logo} />
        <div>
          <h1>ChainDirect</h1>
          <small>Securing your transfers</small>
        </div>
      </div>
      {[
        { type: "Retailer", name: "7-Eleven Manila" },
        { type: "Distributor", name: "LBC Manila" },
        { type: "Manufacturer", name: "Quing Ski Manufacturing" },
        { type: "Supplier", name: "ElectriSource" },
      ].map((item) => {
        return (
          <div className="provenance-track" key={item.type}>
            <span className="provenance-column"></span>
            <span className="provenance-track-icon">
              <FontAwesomeIcon icon={faHouse} />
            </span>
            <div className="provenance-track-org">
              <h1>{item.name}</h1>
              <small>{item.type}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
};
