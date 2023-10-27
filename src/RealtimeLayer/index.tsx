import { RealtimeLayer as MtbRealtimeLayer } from "mobility-toolbox-js/ol";
import { createContext } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import rosetta from "rosetta";

import useMapContext from "../utils/hooks/useMapContext";
import useParams from "../utils/hooks/useParams";
import centerOnVehicle from "../utils/centerOnVehicle";
import { MobilityMapProps } from "../MobilityMap";
import { Feature } from "ol";

const TRACKING_ZOOM = 16;

function RealtimeLayer({
  apikey,
  mots,
  tenant,
  realtimeurl = "wss://api.geops.io/tracker-ws/v1/ws",
}: MobilityMapProps) {
  const {
    isFollowing,
    isTracking,
    lineInfos,
    map,
    realtimeLayer,
    setIsFollowing,
    setIsTracking,
    setLineInfos,
    setRealtimeLayer,
  } = useMapContext();
  const [feature, setFeature] = useState<Feature>();

  const tracker = useMemo(() => {
    if (!apikey || !realtimeurl) {
      return null;
    }
    console.log("ici");
    return new MtbRealtimeLayer({
      apiKey: apikey,
      url: realtimeurl,
      getMotsByZoom: mots ? () => mots.split(",") as RealtimeMot[] : undefined,
      fullTrajectoryStyle: null,
      tenant,
    });
  }, [apikey, mots, tenant]);

  useEffect(() => {
    if (!map || !tracker) {
      return;
    }
    map.once("moveend", () => {
      tracker.attachToMap(map);
    });
    tracker.onClick(([feature]) => {
      setFeature(feature);
    });

    setRealtimeLayer(tracker);

    return () => {
      tracker.detachFromMap();
    };
  }, [map, tracker]);

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
    if (!map) {
      return;
    }
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
  }, [map]);

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

  return null;
}

export default memo(RealtimeLayer);
