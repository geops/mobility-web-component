
import { Map } from "ol";

import BasicMap from "./BasicMap";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";

type Props = {
  apikey: string;
  baselayer: string;
  center: string;
  zoom: string;
  map: Map;
};

window.addEventListener("message", (event) => {
    if (event.data.notification) {
      console.log(event.data.notification); 
    }
  });

export default function NotificationMap({ apikey, baselayer, center, zoom, map } : Props) {
  
    return (
      <>
        <style>{olStyle}</style>
        <style>{style}</style>
        <BasicMap apikey={apikey} baselayer={baselayer} center={center} zoom={zoom} map={map} />
      </>
    );
  }