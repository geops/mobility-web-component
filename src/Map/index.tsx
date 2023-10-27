import { MaplibreLayer, RealtimeLayer } from "mobility-toolbox-js/ol";
import { Map as OlMap } from "ol";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import RouteSchedule from "../RouteSchedule";
import { unByKey } from "ol/Observable";
import { MapContext } from "../utils/hooks/useMapContext";
import centerOnVehicle from "../utils/centerOnVehicle";
import GeolocationButton from "../GeolocationButton";
import { memo } from "preact/compat";
import ScaleLine from "../ScaleLine";
import Copyright from "../Copyright";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import Overlay from "../Overlay";
import type { MobilityMapProps } from "../MobilityMap";
import { PreactDOMAttributes, JSX } from "preact";

export type RealtimeMapProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> &
  MobilityMapProps;

const TRACKING_ZOOM = 16;

const map = new OlMap({ controls: [] });

let MapButtons = ({ children }) => {
  return children;
};
MapButtons = MapButtons;

let MapLayers = ({ children }) => {
  return children;
};
MapLayers = MapLayers;

const MapOverlay = Overlay;

function Map({
  apikey,
  baselayer = "travic_v2",
  center = "831634,5933959",
  zoom = "13",
  mots,
  tenant,
  children,
}: RealtimeMapProps) {
  const ref = useRef();
  const mapRef = useRef();
  const [baseLayer, setBaseLayer] = useState<MaplibreLayer>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [lineInfos, setLineInfos] = useState(false);
  const [realtimeLayer, setRealtimeLayer] = useState<RealtimeLayer>();

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    if (zoom) {
      map.getView().setZoom(parseFloat(zoom));
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }

    return () => {
      map.setTarget();
    };
  }, []);

  const layersPart = (children.length ? children : [children]).find((child) => {
    console.log(child.type, MapLayers);
    return child.type === MapLayers;
  });

  const overlayPart = (children.length ? children : [children]).find(
    (child) => child.type === MapOverlay,
  );

  const buttonsPart = (children.length ? children : [children]).find(
    (child) => child.type === MapButtons,
  );

  return (
    <MapContext.Provider
      value={{
        baseLayer,
        map,
        isFollowing,
        isTracking,
        lineInfos,
        realtimeLayer,
        setBaseLayer,
        setIsFollowing,
        setIsTracking,
        setLineInfos,
        setRealtimeLayer,
      }}
    >
      <style>{olStyle}</style>
      <div ref={ref} className="@container/main w-full h-full relative border">
        {layersPart}
        <div className="w-full h-full relative flex flex-col @lg/main:flex-row-reverse">
          <div ref={mapRef} className="flex-1 relative overflow-hidden ">
            <div className="z-20 absolute right-2 top-2 flex flex-col gap-2">
              {buttonsPart}
            </div>
            <div className="z-10 absolute left-2 right-2 text-[10px] bottom-2 flex justify-between items-end gap-2">
              <ScaleLine
                map={map}
                className={"bg-slate-50 bg-opacity-70"}
              ></ScaleLine>
              <Copyright
                map={map}
                className={"bg-slate-50 bg-opacity-70"}
              ></Copyright>
            </div>
          </div>
          {!!lineInfos && overlayPart}
        </div>
      </div>
    </MapContext.Provider>
  );
}

Map.Buttons = MapButtons;
Map.Layers = MapLayers;
Map.Overlay = Overlay;

export default Map;
