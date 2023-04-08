import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import ProvenanceIndex from "../Provenance/provenance.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faRedo } from "@fortawesome/free-solid-svg-icons";
import "./scanqr.index.css";


export default () => {
  let html5qr: any = useRef(null);
  let [isScanned, setIsScanned] = useState(false);

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
          await html5qr.current.stop();
          setIsScanned(true);
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
    <section className="grid grid-rows-2 h-full justify-center bg-zinc-200">
      <section className="items-center flex row-span-2 bg-slate-100 w-96">
        {
          isScanned ?
            <ProvenanceIndex />
            :
            <div id="qr-scan" className="relative w-96"></div>
        }
      </section>
      <section className={`grid ${isScanned ? 'grid-cols-2' : ''} w-full text-center bg-slate-200`}>
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
