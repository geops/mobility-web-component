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
    stopSequence,
    map,
    mots,
    realtimeurl,
    tenant,
    setIsFollowing,
    setIsTracking,
    setStopSequence,
    setRealtimeLayer,
  } = useMapContext();
  const [feature, setFeature] = useState<Feature>();

  const layer = useMemo(() => {
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
    if (!map || !layer) {
      return () => {};
    }
    if (map.getView()?.getCenter()) {
      layer.attachToMap(map);
    } else {
      map.once("moveend", () => {
        layer.attachToMap(map);
      });
    }

    setRealtimeLayer(layer);

    return () => {
      layer.detachFromMap();
      setRealtimeLayer();
    };
  }, [map, setRealtimeLayer, layer]);

  useEffect(() => {
    if (!layer) {
      return () => {};
    }
    const onClick = ([firstFeature]) => {
      setFeature(firstFeature);
    };
    layer.onClick(onClick);
    return () => {
      layer.unClick(onClick);
    };
  }, [layer]);

  // Behavior when vehicle is selected or not.
  useEffect(() => {
    if (!stopSequence) {
      setIsFollowing(false);
    }
  }, [stopSequence, setIsFollowing]);

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

    if (layer) {
      layer.useThrottle = !isFollowing;
      layer.isUpdateBboxOnMoveEnd = !isFollowing;
      // layer.useRequestAnimationFrame = isFollowing;
      layer.allowRenderWhenAnimating = !!isFollowing;
    }
    if (!isFollowing || !stopSequence || !map || !layer) {
      return () => {};
    }

    setIsTracking(false);

    const followVehicle = async (id: RealtimeTrainId) => {
      let vehicle = id && layer?.trajectories?.[id];

      if (!vehicle) {
        vehicle = await layer.api
          .getTrajectory(stopSequence.id, layer.mode)
          .then((message) => message.content);
      }

      const success = await centerOnVehicle(vehicle, map, TRACKING_ZOOM);

      // Once the map is zoomed on the vehicle we follow him, only recenter , no zoom changes.
      if (success === true) {
        layer.setBbox(layer.vectorLayer.getSource().getExtent());
        interval = setInterval(() => {
          centerOnVehicle(layer?.trajectories?.[stopSequence.id], map);
        }, 1000);
      }
    };
    followVehicle(stopSequence.id);

    return () => {
      clearInterval(interval);
      layer.setBbox();
    };
  }, [isFollowing, map, layer, stopSequence, setIsTracking]);

  useEffect(() => {
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get("train_id");
      layer.api.subscribeStopSequence(vehicleId, ({ content }) => {
        if (content) {
          const [firstStopSequence] = content;
          if (firstStopSequence) {
            setStopSequence(firstStopSequence);
          }
        }
      });
      // No animation, it's nicer for the user.
      const center = layer?.trajectories?.[vehicleId]?.properties?.coordinate;
      if (center) {
        map.getView().setCenter(center);
      }
    } else {
      setStopSequence(null);
    }
    return () => {
      if (vehicleId) {
        layer.api.unsubscribeStopSequence(vehicleId);
      }
    };
  }, [feature, map, setStopSequence, layer]);

  return null;
}

export default memo(RealtimeLayer);
