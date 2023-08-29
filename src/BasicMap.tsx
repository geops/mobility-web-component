import {
  CopyrightControl,
  MaplibreLayer,
} from "mobility-toolbox-js/ol";
import { Map } from "ol";
import ScaleLine from "ol/control/ScaleLine.js";
import { useEffect, useState } from "preact/hooks";
import { ComponentChildren, createContext } from "preact"
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
  children?: ComponentChildren;
};

const copyrightControl = new CopyrightControl({});
const olMap = new Map({ controls: [new ScaleLine()] });

export const MapContext = createContext<Map>(null); 

const useSetBaseLayer = (baselayer: string, apikey: string, map: Map, target: HTMLDivElement ) => {
  const [baseLayer, setBaseLayer] = useState(null);
  useEffect(() => {
    if (target) {
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

function BasicMap({ apikey, baselayer, center, zoom, map = olMap, children }: Props) {
  const [ref, setRef] = useState<HTMLDivElement>();;
  useSetBaseLayer(baselayer, apikey, map, ref);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);  

  return (
    <MapContext.Provider value={map}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div ref={(el) => setRef(el as HTMLDivElement)} className="w-full h-full relative">
        {children}
      </div>
    </MapContext.Provider>
  );
}

export default BasicMap;
