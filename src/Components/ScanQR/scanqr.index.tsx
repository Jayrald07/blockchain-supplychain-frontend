import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import ProvenanceIndex from "../Provenance/provenance.index";
import "./scanqr.index.css";

export default () => {
  let html5qr: any = useRef(null);
  let [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
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
        (error: any) => {}
      );
    } catch (error) {
      console.error({ error });
    }
  }, []);

  return isScanned ? (
    <ProvenanceIndex />
  ) : (
    <section className="qr-scan-container">
      <a href="/login" className="qr-scan-back">
        Back
      </a>
      <div id="qr-scan"></div>
    </section>
  );
};
