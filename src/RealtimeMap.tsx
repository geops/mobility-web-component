import {
  CopyrightControl,
  RealtimeLayer,
  MaplibreLayer,
} from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";
import { Map } from "ol";
import Geolocation from "ol/Geolocation";
import ScaleLine from "ol/control/ScaleLine.js";
import { fromLonLat } from "ol/proj";
import { createContext } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot } from "mobility-toolbox-js/types";
import { Point } from "ol/geom";
import rosetta from "rosetta";

import RouteSchedule from "./RouteSchedule";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";
import { unByKey } from "ol/Observable";
import centerOnVehicle from "./utils/centerOnVehicle";
import getFullTrajectoryAndFit from "./utils/getFullTrajectoryAndFit";

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

const TRACKING_ZOOM = 16;

const geolocation = new Geolocation();

function GeolocationControl({ isTracking, onClick }) {
  useEffect(() => {
    geolocation.setTracking(isTracking);
  }, [isTracking]);

  return (
    <button
      className="absolute right-4 top-4 z-10 bg-white shadow-lg rounded-full p-1"
      onClick={onClick}
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
  const [isTracking, setIsTracking] = useState(false); // user position tracking
  const [isFollowing, setIsFollowing] = useState(false); // vehicle position tracking
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);

  const tracker = useMemo(() => {
    if (apikey) {
      return new RealtimeLayer({
        apiKey: apikey,
        url: "wss://tralis-tracker-api.geops.io/ws",
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

  // Behavior when vehicle is selected or not.
  useEffect(() => {
    if (!lineInfos) {
      setIsFollowing(false);
    } else {
    }
  }, [lineInfos]);

  // Behavior when user tracking is activated or not.
  useEffect(() => {
    let olKeys = [];
    if (isTracking) {
      setIsFollowing(false);
      olKeys = [
        // First time we zoom and center on the position
        geolocation.once("change:position", (evt) => {
          const position = evt.target.getPosition();
          if (evt.target.getPosition()) {
            map.getView().setZoom(TRACKING_ZOOM);
            map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
          }
        }),
        // then we only center the map.
        geolocation.on("change:position", (evt) => {
          const position = evt.target.getPosition();
          if (evt.target.getPosition()) {
            map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
          }
        }),
      ];
    }
    return () => {
      unByKey(olKeys);
    };
  }, [isTracking]);

  // Deactive auto zooming when the user pans the map
  useEffect(() => {
    let onMovestartKey = null;
    onMovestartKey = map.getView().on("change:center", (evt) => {
      if (evt.target.getInteracting()) {
        setIsFollowing(false);
        setIsTracking(false);
      }
    });
    return () => {
      unByKey(onMovestartKey);
    };
  }, []);

  useEffect(() => {
    let interval = null;
    let interval2 = null;

    if (tracker) {
      tracker.allowRenderWhenAnimating = !!isFollowing;
    }
    if (!isFollowing || !lineInfos || !map || !tracker) {
      return;
    }

    setIsTracking(false);

    const vehicle = lineInfos.id && tracker?.trajectories?.[lineInfos.id];
    const promise = vehicle
      ? Promise.resolve(true)
      : getFullTrajectoryAndFit(map, tracker, lineInfos.id);

    promise
      .then((success) => {
        // We wait that the vehicle is on the map, the we zoom on it
        const promise = new Promise((resolve) => {
          interval2 = setInterval(() => {
            const vehicle =
              lineInfos.id && tracker?.trajectories?.[lineInfos.id];
            if (vehicle) {
              centerOnVehicle(map, tracker, lineInfos.id, TRACKING_ZOOM)
                .then(() => {
                  resolve(true);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }, 1000);
        });
        return promise;
      })
      .then((success) => {
        // Once the map is zoomed on the vehicle we follow him, on ly recenter , no zoom chnages.
        if (success) {
          clearInterval(interval2);
          interval = setInterval(() => {
            centerOnVehicle(map, tracker, lineInfos.id);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      clearInterval(interval2);
      clearInterval(interval);
    };
  }, [isFollowing, map, tracker, lineInfos]);

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
      const vehicle = vehicleId && tracker.trajectories?.[vehicleId];
      let center = vehicle?.properties.coordinate;
      if (vehicle && !center) {
        // If the vehicle is not on the intial extent (vehicle is null), we try to zoom first on its raw_coordinates property
        // then the layer will set the coordinate property after the first render.
        center = vehicle?.properties.raw_coordinates;
        if (center) {
          center = fromLonLat(center);
        }
      }

      if (!center) {
        return;
      }
      const view = map.getView();
      const pt = new Point(center);
      // HACK: how do we get the Routeinfos width?
      pt.translate(-150 * view.getResolution(), 0);
      center = pt.getCoordinates().map((coord: number) => Math.floor(coord));
      view.animate({
        center,
        duration: 500,
        easing: linear,
      });
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
          map={map}
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
          isFollowing={isFollowing}
          onFollowButtonClick={() => {
            setIsFollowing(!isFollowing);
          }}
        />
        <GeolocationControl
          isTracking={isTracking}
          onClick={() => {
            setIsTracking(!isTracking);
          }}
        />
      </div>
    </I18nContext.Provider>
  );
}

export default RealtimeMap;
