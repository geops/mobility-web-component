import { RealtimeLayer, MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { createContext } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import rosetta from "rosetta";
import RouteSchedule from "./RouteSchedule";
import { unByKey } from "ol/Observable";
import centerOnVehicle from "./utils/centerOnVehicle";
import GeolocationButton from "./GeolocationButton";
import ScaleLine from "./ScaleLine";
import Copyright from "./Copyright";
import ScrollableHandler from "./ScrollableHandler";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";
// @ts-ignore
import realtimeMapCss from "./RealtimeMap.css";
import { fromLonLat } from "ol/proj";

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

const map = new Map({ controls: [] });

function RealtimeMap({
  apikey,
  baselayer = "travic_v2",
  center = "831634,5933959",
  zoom = "13",
  mots,
  tenant,
}: Props) {
  const ref = useRef();
  const mapRef = useRef();
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
        url: "wss://api.geops.io/tracker-ws/dev/ws",
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

    if (mapRef.current) {
      map.setTarget(mapRef.current);
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
      tracker.useThrottle = !isFollowing;
      // tracker.useRequestAnimationFrame = isFollowing;
      tracker.allowRenderWhenAnimating = !!isFollowing;
    }
    if (!isFollowing || !lineInfos || !map || !tracker) {
      return;
    }

    setIsTracking(false);

    const followVehicle = async (id: RealtimeTrainId) => {
      let vehicle = id && tracker?.trajectories?.[id];

      if (!vehicle) {
        vehicle = await tracker.api
          .getTrajectory(lineInfos.id, tracker.mode)
          .then((message) => message.content);
      }

      const success = await centerOnVehicle(vehicle, map, TRACKING_ZOOM);

      // Once the map is zoomed on the vehicle we follow him, only recenter , no zoom changes.
      if (success === true) {
        interval = setInterval(() => {
          centerOnVehicle(tracker?.trajectories?.[lineInfos.id], map);
        }, 1000);
      }
    };
    followVehicle(lineInfos.id);

    return () => {
      clearInterval(interval);
    };
  }, [isFollowing, map, tracker, lineInfos]);

  useEffect(() => {
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get("train_id");
      tracker.api.subscribeStopSequence(vehicleId, ({ content }) => {
        if (content) {
          const [stopSequence] = content;
          if (stopSequence) {
            setLineInfos(stopSequence);
          }
        }
      });
      // No animation, it's nicer for the user.
      const center = tracker?.trajectories?.[vehicleId]?.properties?.coordinate;
      if (center) {
        map.getView().setCenter(center);
      }
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
      <style>{realtimeMapCss}</style>
      <div ref={ref} className="@container/main w-full h-full relative border">
        <div className="w-full h-full relative flex flex-col @lg/main:flex-row-reverse">
          <div ref={mapRef} className="flex-1 relative overflow-hidden ">
            <div className="z-20 absolute right-2 top-2 flex flex-col gap-2">
              <GeolocationButton
                map={map}
                isTracking={isTracking}
                onClick={() => {
                  setIsTracking(!isTracking);
                }}
              />
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
          <div
            className={`flex-0 relative overflow-hidden flex flex-col transition-[min-height,max-height] @lg:transition-[width]  ${
              lineInfos
                ? "w-full min-h-[75px] max-h-[70%] @lg:w-[350px] @lg:max-h-full @lg:h-[100%!important] border-t @lg:border-t-0 @lg:border-r"
                : "min-h-0 max-h-0 @lg:w-0"
            }`}
          >
            {!!lineInfos && (
              <>
                <ScrollableHandler
                  className="z-10 absolute inset-0 h-[65px] touch-none @lg:hidden flex justify-center"
                  style={{ width: "calc(100% - 60px)" }}
                >
                  <div
                    className="bg-gray-300 m-2 -mr-[60px]"
                    style={{
                      width: 32,
                      height: 4,
                      borderRadius: 2,
                    }}
                  ></div>
                </ScrollableHandler>
                <RouteSchedule
                  className="z-5 relative overflow-x-hidden overflow-y-auto  scrollable-inner"
                  lineInfos={lineInfos}
                  trackerLayer={tracker}
                  onStationClick={(station) => {
                    if (station.coordinate) {
                      map.getView().animate({
                        zoom: map.getView().getZoom(),
                        center: [station.coordinate[0], station.coordinate[1]],
                      });
                    }
                  }}
                  isFollowing={isFollowing}
                  onFollowButtonClick={() => {
                    setIsFollowing(!isFollowing);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </I18nContext.Provider>
  );
}

export default RealtimeMap;
