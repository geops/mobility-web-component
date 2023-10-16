import { RealtimeLayer as MtbRealtimeLayer } from "mobility-toolbox-js/ol";
import { createContext } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import { unByKey } from "ol/Observable";
import rosetta from "rosetta";

import GeolocationButton from "../GeolocationButton";
import ScrollableHandler from "../ScrollableHandler";
import RouteSchedule from "./RouteSchedule";
import useMapContext from "../utils/hooks/useMapContext";
import useParams from "../utils/hooks/useParams";
import centerOnVehicle from "../utils/centerOnVehicle";

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

const TRACKING_ZOOM = 16;

let deltaToTop = 0;

function onDragg(evt: PointerEvent) {
  this.style.maxHeight = `calc(100% - ${evt.y - deltaToTop}px)`;
  evt.stopPropagation();
  evt.preventDefault();
}

function onDragStop(evt: PointerEvent) {
  this.style.transitionDuration = ".5s";
  if (this.clientHeight < 62) {
    this.isMinimized = true;
  }
  (evt.target as HTMLElement).releasePointerCapture(evt.pointerId);

  document.removeEventListener("pointermove", this.onDragg);
  document.removeEventListener("pointerup", this.onDragStop);
  evt.stopPropagation();
  evt.preventDefault();
}

function RealtimeLayer({
  apikey,
  mots: propMots,
  tenant,
  realtimeUrl = "wss://tralis-tracker-api.geops.io/ws",
}: Props) {
  const { map } = useMapContext();
  const {
    realtimeurl: paramsRealtimeUrl,
    tenant: paramsTenant,
    mots: paramsMots,
  } = useParams();
  const [lineInfos, setLineInfos] = useState(null);
  const [isTracking, setIsTracking] = useState(false); // user position tracking
  const [isFollowing, setIsFollowing] = useState(false); // vehicle position tracking
  const [feature, setFeature] = useState(null);
  const mots = paramsMots || propMots;

  const tracker = useMemo(() => {
    if (apikey) {
      return new MtbRealtimeLayer({
        apiKey: apikey,
        url: paramsRealtimeUrl || realtimeUrl,
        getMotsByZoom: mots
          ? () => mots.split(",") as RealtimeMot[]
          : undefined,
        fullTrajectoryStyle: null,
        tenant: paramsTenant || tenant,
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
  }, [tracker]);

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

  return (
    <I18nContext.Provider value={i18n}>
      <div className="z-20 absolute right-2 top-2 flex flex-col gap-2">
        <GeolocationButton
          map={map}
          isTracking={isTracking}
          onClick={() => {
            setIsTracking(!isTracking);
          }}
        />
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
                  const size = map.getSize();
                  const extent = map.getView().calculateExtent(size);
                  const offset = (extent[2] - extent[0]) / 5;

                  map.getView().animate({
                    zoom: map.getView().getZoom(),
                    center: [
                      station.coordinate[0] - offset,
                      station.coordinate[1],
                    ],
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
    </I18nContext.Provider>
  );
}

export default RealtimeLayer;
