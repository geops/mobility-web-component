import { RealtimeLayer, MaplibreLayer } from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";
import { Map } from "ol";
import { createContext } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type {
  RealtimeMot,
  RealtimeStation,
  RealtimeStationproperties,
} from "mobility-toolbox-js/types";
import { Point } from "ol/geom";
import rosetta from "rosetta";
import RouteSchedule from "./RouteSchedule";
import { unByKey } from "ol/Observable";
import centerOnVehicle from "./utils/centerOnVehicle";
import getFullTrajectoryAndFit from "./utils/getFullTrajectoryAndFit";
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

function RealtimeMap({ apikey, baselayer, center, mots, tenant, zoom }: Props) {
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
      tracker.api.subscribeStopSequence(vehicleId, ({ content }) => {
        if (content) {
          const [stopSequence] = content;
          if (stopSequence) {
            setLineInfos(stopSequence);
          }
        }
      });
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
            className={`flex-0 relative overflow-hidden border-t @lg:borderstopSequence-t-0 @lg:border-r flex flex-col ${
              lineInfos
                ? "w-full min-h-[75px] max-h-[70%] @lg:w-[350px] @lg:max-h-full @lg:h-[100%!important]"
                : "hidden"
            }`}
          >
            {!!lineInfos && (
              <>
                <ScrollableHandler className="z-10 absolute inset-0 w-full h-[60px] touch-none @lg:hidden flex justify-center ">
                  <div
                    className="bg-gray-300"
                    style={{
                      width: 32,
                      height: 4,
                      borderRadius: 2,
                      margin: 6,
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
