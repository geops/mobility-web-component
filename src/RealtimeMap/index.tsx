import { RealtimeLayer, MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import RouteSchedule from "../RouteSchedule";
import { unByKey } from "ol/Observable";
import centerOnVehicle from "../utils/centerOnVehicle";
import GeolocationButton from "../GeolocationButton";
import ScaleLine from "../ScaleLine";
import Copyright from "../Copyright";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import Overlay from "../Overlay";
import type { MobilityMapProps } from "../MobilityMap";

export type RealtimeMapProps = MobilityMapProps;

const TRACKING_ZOOM = 16;

const map = new Map({ controls: [] });

function RealtimeMap({
  apikey,
  baselayer = "travic_v2",
  center = "831634,5933959",
  zoom = "13",
  mots,
  tenant,
}: RealtimeMapProps) {
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
    <>
      <style>{olStyle}</style>
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
          <Overlay
            ScrollableHandlerProps={{ style: { width: "calc(100% - 60px)" } }}
          >
            {!!lineInfos && (
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
            )}
          </Overlay>
        </div>
      </div>
    </>
  );
}

export default RealtimeMap;
