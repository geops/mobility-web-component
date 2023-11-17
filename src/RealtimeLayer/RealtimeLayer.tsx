import { RealtimeLayer as MtbRealtimeLayer } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";

import { Feature } from "ol";
import type { OlRealtimeLayerOptions } from "mobility-toolbox-js/ol/layers/RealtimeLayer";
import useMapContext from "../utils/hooks/useMapContext";
import centerOnVehicle from "../utils/centerOnVehicle";
import getDelayTextForVehicle from "../utils/getDelayTextForVehicle";
import getDelayColorForVehicle from "../utils/getDelayColorForVehicle";
import getDelayFontForVehicle from "../utils/getDelayFontForVehicle";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";

const TRACKING_ZOOM = 16;

export type RealtimeLayerProps = OlRealtimeLayerOptions;

function RealtimeLayer(props: RealtimeLayerProps) {
  const {
    apikey,
    isFollowing,
    isTracking,
    lineInfos,
    map,
    mots,
    realtimeurl,
    tenant,
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
    return new MtbRealtimeLayer({
      apiKey: apikey,
      tenant,
      url: realtimeurl,
      getMotsByZoom: mots ? () => mots.split(",") as RealtimeMot[] : undefined,
      styleOptions: {
        getDelayColor: getDelayColorForVehicle,
        getDelayText: getDelayTextForVehicle,
        getDelayFont: getDelayFontForVehicle,
        getTextFont: getTextFontForVehicle,
      },
      ...props,
    });
  }, [apikey, mots, realtimeurl, tenant, props]);

  useEffect(() => {
    if (!map || !tracker) {
      return () => {};
    }
    if (map.getView()?.getCenter()) {
      tracker.attachToMap(map);
    } else {
      map.once("moveend", () => {
        tracker.attachToMap(map);
      });
    }

    setRealtimeLayer(tracker);

    return () => {
      tracker.detachFromMap();
      setRealtimeLayer();
    };
  }, [map, setRealtimeLayer, tracker]);

  useEffect(() => {
    if (!tracker) {
      return () => {};
    }
    const onClick = ([firstFeature]) => {
      setFeature(firstFeature);
    };
    tracker.onClick(onClick);
    return () => {
      tracker.unClick(onClick);
    };
  }, [tracker]);

  // Behavior when vehicle is selected or not.
  useEffect(() => {
    if (!lineInfos) {
      setIsFollowing(false);
    }
  }, [lineInfos, setIsFollowing]);

  // Behavior when user tracking is activated or not.
  useEffect(() => {
    const olKeys = [];
    if (isTracking) {
      setIsFollowing(false);
    }
    return () => {
      unByKey(olKeys);
    };
  }, [isTracking, setIsFollowing]);

  // Deactive auto zooming when the user pans the map
  useEffect(() => {
    if (!map) {
      return () => {};
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
  }, [map, setIsFollowing, setIsTracking]);

  useEffect(() => {
    let interval = null;

    if (tracker) {
      tracker.useThrottle = !isFollowing;
      // tracker.useRequestAnimationFrame = isFollowing;
      tracker.allowRenderWhenAnimating = !!isFollowing;
    }
    if (!isFollowing || !lineInfos || !map || !tracker) {
      return () => {};
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
  }, [isFollowing, map, tracker, lineInfos, setIsTracking]);

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
  }, [feature, map, setLineInfos, tracker]);

  return null;
}

export default memo(RealtimeLayer);
