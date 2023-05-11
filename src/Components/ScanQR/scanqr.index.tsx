import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import ProvenanceIndex from "../Provenance/provenance.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faRedo, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./scanqr.index.css";
import Logo from "../../assets/logo.png"
import { HttpMethod, api } from "../../services/http";
import { validateAndReturn } from "../../utilities";

export default () => {
  let html5qr: any = useRef(null);
  let [isScanned, setIsScanned] = useState(false);
  let [assetDetail, setAssetDetatil] = useState({});
  let [scanning, setScanning] = useState(false);

  const handleScan = () => {
    try {
      html5qr.current = new Html5Qrcode("qr-scan");
      html5qr.current.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          disableFlip: false,
          qrbox: { width: 200, height: 200 },
        },
        async (text: any, result: any) => {
          let values = text.split(":")
          if (values.length === 3) {
            if (!scanning) {
              setScanning(true);
              const history = await api("/getAssetHistory", HttpMethod.POST, {
                orgId: values[0],
                channelId: values[1],
                assetId: values[2]
              });
              if (history.message === "Done") {
                let _history = validateAndReturn(history);
                setAssetDetatil(_history);
                await html5qr.current.stop();
                setIsScanned(true);

              }
              setScanning(false)
            }
          }
        },
        (error: any) => { }
      );
    } catch (error) {

    }
  }

  useEffect(() => {
    handleScan();
  }, [isScanned]);

  return (
    <section className="grid grid-rows-2 h-full justify-center bg-slate-200">
      {
        scanning
          ? <div className="fixed z-50 top-0 let-0 w-full h-full bg-slate-200 flex items-center justify-center">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span className="block">Getting the info...</span>
            </div>
          </div> : null
      }
      <section className="items-center flex row-span-2 bg-slate-100 w-96">
        {
          isScanned ?
            <ProvenanceIndex assetDetail={assetDetail} />
            :
            <div className="grid">
              <img src={Logo} className="w-44 mb-10 justify-self-center" />

              <div id="qr-scan" className="relative w-96"></div>
            </div>
        }
      </section>
      <section className={`grid ${isScanned ? 'grid-cols-2' : ''}  w-full text-center bg-slate-200`}>
        <a href="/login" className=" px-2 py-3 ">
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm mr-2" />
          Back
        </a>
        {
          isScanned ?
            <a onClick={() => setIsScanned(false)} className=" px-2 py-3 ">
              <FontAwesomeIcon icon={faRedo} className="text-sm mr-2" />
              Scan Again
            </a> : null
        }
      </section>
    </section>
  );
};
