import "./provenance.index.css";
import Logo from "../../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default ({ assetDetail }: { assetDetail: any }) => {
  if (typeof assetDetail !== "object") return <div className="p-10 text-center">
    <h1>Cannot find it.</h1>
    <small className="font-light">The item might be already transferred to another organization</small>
  </div>
  return (
    <section className="p-10">
      <div className="mb-10">
        <img src={Logo} className="w-32 mb-2" />
        <div>
          <h1 className="font-bold">Item: <span className="font-light">{assetDetail.asset_name}</span></h1>
        </div>
      </div>
      {assetDetail.history.map((item: any) => {
        return (
          <div key={item._id} className="flex gap-x-2 mb-11 relative">
            <span className="w-1 h-14 left-2 top-7 absolute bg-slate-200"></span>
            <span>
              <FontAwesomeIcon icon={faHouse} className="text-blue-900" />
            </span>
            <div className="justify-start">
              <h1>{item.organization_display_name ? item.organization_display_name : item.organization_name}</h1>
              <small className="font-light text-xs block">{new Date(item.timestamp * 1000).toLocaleString()}</small>
              <small className="font-light text-xs p-1 px-2 bg-slate-200 rounded">{item.organization_type_id.organization_type_name}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
};
