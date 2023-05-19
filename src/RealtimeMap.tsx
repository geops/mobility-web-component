import {
  CopyrightControl,
  RealtimeLayer,
  MaplibreLayer,
} from "mobility-toolbox-js/ol";
import { Map } from "ol";
import Geolocation from "ol/Geolocation";
import ScaleLine from "ol/control/ScaleLine.js";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot } from "mobility-toolbox-js/types";

import RouteSchedule from "./RouteSchedule";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.scss";

type Props = {
  apikey: string;
  baselayer: string;
  center: string;
  mots?: string;
  tenant: string;
  zoom: string;
};

const geolocation = new Geolocation();
geolocation.on("change:position", () => {
  const position = geolocation.getPosition();
  if (position) {
    map.getView().setCenter(position);
  }
});
geolocation.on("change:tracking", () => {
  const position = geolocation.getPosition();
  const tracking = geolocation.getTracking();
  if (position && tracking) {
    map.getView().setZoom(16);
  }
});

function GeolocationControl() {
  const [isTracking, setIsTracking] = useState(false);
  return (
    <button
      className={`geolocation-control ${isTracking ? "tracking" : ""}`}
      onClick={() => {
        setIsTracking(!isTracking);
        geolocation.setTracking(!isTracking);
      }}
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        focusable="false"
        height="1.5em"
        width="1.5em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z"></path>
      </svg>
    </button>
  );
}

const copyrightControl = new CopyrightControl({});
const map = new Map({ controls: [new ScaleLine()] });

function RealtimeMap({ apikey, baselayer, center, mots, tenant, zoom }: Props) {
  const ref = useRef();
  const [lineInfos, setLineInfos] = useState(null);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);

  const tracker = useMemo(() => {
    if (apikey) {
      return new RealtimeLayer({
        apiKey: apikey,
        url: "wss://api.geops.io/tracker-ws/v1/",
        getMotsByZoom: () => mots.split(",") as RealtimeMot[],
        fullTrajectoryStyle: null,
        tenant,
      });
    }
  }, [apikey, mots, tenant]);

  useEffect(() => {
    if (!tracker) {
      return;
    }

    if (ref.current) {
      map.setTarget(ref.current);
      map.updateSize();
    }

    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `https://maps.geops.io/styles/${baselayer}/style.json`,
    });
    layer.attachToMap(map);

    tracker.attachToMap(map);
    tracker.onClick(([feature]) => {
      if (feature) {
        const vehicleId = feature.get("train_id");
        tracker.api.getStopSequence(vehicleId).then((stopSequence) => {
          setLineInfos(stopSequence.content[0]);
        });
      } else {
        setLineInfos(null);
      }
    });

    copyrightControl.attachToMap(map);

    return () => {
      map.setTarget();
    };
  }, [baselayer, tracker]);

  return (
    <>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div ref={ref} className="rt-map">
        <RouteSchedule lineInfos={lineInfos} trackerLayer={tracker} />
        <GeolocationControl />
      </div>
    </>
  );
}

export default RealtimeMap;
