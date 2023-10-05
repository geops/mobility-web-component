import {
  CopyrightControl,
  RealtimeLayer,
  MaplibreLayer,
} from "mobility-toolbox-js/ol";
import { Map } from "ol";
import Geolocation from "ol/Geolocation";
import ScaleLine from "ol/control/ScaleLine.js";
import { fromLonLat } from "ol/proj";
import { createContext } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot } from "mobility-toolbox-js/types";
import rosetta from "rosetta";

import RouteSchedule from "./RouteSchedule";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";

const i18n = rosetta({
  de: {
    depature_rail: "Gleis",
    depature_ferry: "Steg",
    depature_other: "Kante",
  },
  en: {
    depature_rail: "platform",
    depature_ferry: "pier",
    depature_other: "stand",
  },
  fr: {
    depature_rail: "voie",
    depature_ferry: "quai",
    depature_other: "quai",
  },
  it: {
    depature_rail: "binario",
    depature_ferry: "imbarcadero",
    depature_other: "corsia",
  },
});

// Set current language to preferred browser language with fallback to english
i18n.locale(
  navigator.languages // @ts-ignore
    .find((l) => i18n.table(l.split("-")[0]) !== undefined)
    ?.split("-")[0] || "en",
);

export const I18nContext = createContext(i18n);

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
    map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
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
      className="absolute right-4 top-4 z-10 bg-white shadow-lg rounded-full p-1"
      onClick={() => {
        setIsTracking(!isTracking);
        geolocation.setTracking(!isTracking);
      }}
    >
      <svg
        className={isTracking ? "animate-pulse" : ""}
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
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);

  const tracker = useMemo(() => {
    if (apikey) {
      return new RealtimeLayer({
        apiKey: apikey,
        url: "wss://api.geops.io/tracker-ws/v1/ws",
        getMotsByZoom: mots
          ? () => mots.split(",") as RealtimeMot[]
          : undefined,
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
      setFeature(feature);
    });

    copyrightControl.attachToMap(map);

    return () => {
      map.setTarget();
    };
  }, [baselayer, tracker]);

  useEffect(() => {
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get("train_id");
      tracker.api.subscribeStopSequence(
        vehicleId,
        ({ content: [stopSequence] }) => {
          if (stopSequence) {
            setLineInfos(stopSequence);
          }
        },
      );
    } else {
      setLineInfos(null);
    }
    return () => {
      if (vehicleId) {
        tracker.api.unsubscribeStopSequence(vehicleId);
      }
    };
  }, [feature]);

  return (
    <I18nContext.Provider value={i18n}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div ref={ref} className="w-full h-full relative">
        <RouteSchedule
          lineInfos={lineInfos}
          trackerLayer={tracker}
          onStationClick={(station) => {
            if (station.coordinate) {
              const size = map.getSize();
              const extent = map.getView().calculateExtent(size);
              const offset = (extent[2] - extent[0]) / 5;

              map.getView().animate({
                zoom: map.getView().getZoom(),
                center: [station.coordinate[0] - offset, station.coordinate[1]],
              });
            }
          }}
        />
        <GeolocationControl />
      </div>
    </I18nContext.Provider>
  );
}

export default RealtimeMap;
