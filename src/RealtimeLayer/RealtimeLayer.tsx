import { RealtimeLayer as MtbRealtimeLayer } from "mobility-toolbox-js/ol";
import Geolocation from "ol/Geolocation";
import { fromLonLat } from "ol/proj";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import type { RealtimeMot } from "mobility-toolbox-js/types";
import rosetta from "rosetta";

import RouteSchedule from "./RouteSchedule";
import { MapContext } from "../MobilityToolboxMap";

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
  mots?: string;
  tenant: string;
  realtimeUrl: string;
};

const geolocation = new Geolocation();

function GeolocationControl() {
  const [isTracking, setIsTracking] = useState(false);
  const { map } = useContext(MapContext);

  useEffect(() => {
    geolocation.on("change:position", () => {
      const position = geolocation.getPosition();
      console.log(position);
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
  }, []);

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


function RealtimeLayer({ apikey, mots, tenant, realtimeUrl = "wss://tralis-tracker-api.geops.io/ws" }: Props) {
  const [lineInfos, setLineInfos] = useState(null);
  const { map } = useContext(MapContext);
  const [feature, setFeature] = useState(null);

  const tracker = useMemo(() => {
    if (apikey) {
      return new MtbRealtimeLayer({
        apiKey: apikey,
        url: realtimeUrl,
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

    tracker.attachToMap(map);
    tracker.onClick(([feature]) => {
      setFeature(feature);
    });

    return () => {
      map.setTarget();
    };
  }, [ tracker]);

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
      </I18nContext.Provider>
  );
}

export default RealtimeLayer;
