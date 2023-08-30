import {
  CopyrightControl,
  MaplibreLayer,
} from "mobility-toolbox-js/ol";
import { Map } from "ol";
import ScaleLine from "ol/control/ScaleLine.js";
import { useEffect, useState } from "preact/hooks";
import { createContext } from "preact"
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";
import RealtimeLayer from "./RealtimeLayer/RealtimeLayer";
import NotificationLayer from "./NotificationLayer/NotificationLayer";


type Props = {
  type: "basic"|"realtime"|"notification";
  apikey: string;
  baselayer: string;
  center: string;
  zoom: string;
  mots: string;
  tenant: string;
  mode: "schematic"|"topographic";
};

const copyrightControl = new CopyrightControl({});
const map = new Map({ controls: [new ScaleLine()] });

export const MapContext = createContext(null); 

const useSetBaseLayer = (baselayer: string, apikey: string, map: Map, target: HTMLDivElement ) => {
  const [baseLayer, setBaseLayer] = useState(null);
  useEffect(() => {
    if (apikey && target) {
      map.setTarget(target);
      map.updateSize();

      const layer = new MaplibreLayer({
        apiKey: apikey,
        url: `https://maps.geops.io/styles/${baselayer}/style.json`,
      });
      layer.attachToMap(map);
  
      copyrightControl.attachToMap(map);
      setBaseLayer(layer)
    }
    return () => {
      map.setTarget();
    };
  }, [baselayer, target, apikey])
  return baseLayer;
}

function MobilityToolboxMap({ type = "basic", apikey, baselayer, center, mots, tenant, zoom, mode = "topographic" }: Props) {
  const [ref, setRef] = useState<HTMLDivElement>();
  const baseLayer = useSetBaseLayer(baselayer, apikey, map, ref);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);  

  return (
    <MapContext.Provider value={{map, baseLayer}}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div ref={(el) => setRef(el as HTMLDivElement)} className="w-full h-full relative">
        {baseLayer && type === "realtime" ? (
          <RealtimeLayer apikey={apikey} mots={mots} tenant={tenant} />
        ) : null}
        {baseLayer && type === "notification" ? (
          <NotificationLayer mode={mode}/>
        ) : null}
      </div>
    </MapContext.Provider>
  );
}

export default MobilityToolboxMap;
