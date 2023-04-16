import "./provenance.index.css";
import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default () => {
  return (
    <section className="p-10">
      <div className="mb-10">
        <img src={Logo} className="w-32 mb-2" />
        <div>
          {/* <small className="font-light">Securing your transfers</small> */}
        </div>
      </div>
      {[
        { type: "Retailer", name: "7-Eleven Manila" },
        { type: "Distributor", name: "LBC Manila" },
        { type: "Manufacturer", name: "Quing Ski Manufacturing" },
        { type: "Supplier", name: "ElectriSource" },
      ].map((item) => {
        return (
          <div key={item.type} className="flex gap-x-2 mb-11 relative">
            <span className="w-1 h-14 left-2 top-7 absolute bg-slate-200"></span>
            <span>
              <FontAwesomeIcon icon={faHouse} className="text-blue-900" />
            </span>
            <div>
              <h1>{item.name}</h1>
              <small className="font-light text-xs">{item.type}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
};
