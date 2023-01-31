import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import ButtonIndex from "../Button/button.index";
import "./scanqr.index.css";

export default () => {
  let html5qr: any = useRef(null);

  useEffect(() => {
    html5qr.current = new Html5Qrcode("qr-scan");
    Html5Qrcode.getCameras().then((devices) => {
      var camera = devices[0].id;
      console.log({ camera: devices[0].label });

      html5qr.current.start(
        camera,
        {
          fps: 10,
          disableFlip: false,
          qrbox: { width: 200, height: 200 },
        },
        (text: any, result: any) => console.log({ text, result }),
        (error: any) => {}
      );
    });
  }, []);

  return (
    <section className="qr-scan-container">
      <div id="qr-scan"></div>
    </section>
  );
};
