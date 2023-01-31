import { Html5Qrcode } from "html5-qrcode";
import { CameraDevice } from "html5-qrcode/esm/camera/core";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import ButtonIndex from "../Button/button.index";
import "./scanqr.index.css";

export default () => {
  let html5qr: any = useRef(null);
  const [camera, setCamera] = useState([]);

  const handleSetCamera = async (event: any) => {
    console.log(html5qr.current.isScanning);
    if (html5qr.current.isScanning) await html5qr.current.stop();

    html5qr.current.start(
      event.target.value,
      {
        fps: 10,
        disableFlip: false,
        qrbox: { width: 200, height: 200 },
      },
      (text: any, result: any) => console.log({ text, result }),
      (error: any) => {}
    );
  };

  useEffect(() => {
    Html5Qrcode.getCameras().then((devices: any) => {
      setCamera(devices);
    });

    html5qr.current = new Html5Qrcode("qr-scan");
  }, []);

  return (
    <section className="qr-scan-container">
      <div id="qr-scan"></div>
      <select onChange={handleSetCamera}>
        {camera.map((item: CameraDevice) => (
          <option value={item.id} key={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </section>
  );
};
