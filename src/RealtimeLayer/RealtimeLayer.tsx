import type { RealtimeMot, RealtimeTrainId } from "mobility-toolbox-js/types";

import { RealtimeLayer as MtbRealtimeLayer } from "mobility-toolbox-js/ol";
import { RealtimeLayerOptions } from "mobility-toolbox-js/ol/layers/RealtimeLayer";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import centerOnVehicle from "../utils/centerOnVehicle";
import getDelayColorForVehicle from "../utils/getDelayColorForVehicle";
import getDelayFontForVehicle from "../utils/getDelayFontForVehicle";
import getDelayTextForVehicle from "../utils/getDelayTextForVehicle";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";
import useMapContext from "../utils/hooks/useMapContext";

const TRACKING_ZOOM = 16;

export type RealtimeLayerProps = RealtimeLayerOptions;

function RealtimeLayer(props: RealtimeLayerProps) {
  const {
    apikey,
    isFollowing,
    isTracking,
    map,
    mots,
    realtimeurl,
    setIsFollowing,
    setIsTracking,
    setRealtimeLayer,
    setStation,
    setStopSequence,
    stationId,
    stopSequence,
    tenant,
    trainId,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!apikey || !realtimeurl) {
      return null;
    }
    const layer = new MtbRealtimeLayer({
      apiKey: apikey,
      getMotsByZoom: mots
        ? () => {
            return mots.split(",") as RealtimeMot[];
          }
        : undefined,
      tenant,
      url: realtimeurl,
      ...props,
      styleOptions: {
        getDelayColor: getDelayColorForVehicle,
        getDelayFont: getDelayFontForVehicle,
        getDelayText: getDelayTextForVehicle,
        getText: getTextForVehicle,
        getTextFont: getTextFontForVehicle,
        ...(props?.styleOptions || {}),
      },
    });

    layer.setZIndex(1);

    return layer;
  }, [apikey, mots, realtimeurl, tenant, props]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }
    if (map.getView()?.getCenter()) {
      map.addLayer(layer);
    } else {
      map.once("moveend", () => {
        map.addLayer(layer);
      });
    }

    setRealtimeLayer(layer);

    return () => {
      map.removeLayer(layer);
      setRealtimeLayer(null);
    };
  }, [map, setRealtimeLayer, layer]);

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
  }, [map, setIsFollowing, setIsTracking]);

  useEffect(() => {
    let interval = null;

    if (layer) {
      layer.engine.useThrottle = !isFollowing;
      layer.engine.isUpdateBboxOnMoveEnd = !isFollowing;
      // layer.useRequestAnimationFrame = isFollowing;
      layer.allowRenderWhenAnimating = !!isFollowing;
    }
    if (!isFollowing || !stopSequence || !map || !layer) {
      return;
    }

    setIsTracking(false);

    const followVehicle = async (id: RealtimeTrainId) => {
      let vehicle = id && layer?.trajectories?.[id];

      if (!vehicle) {
        const message = await layer.api.getTrajectory(
          stopSequence.id,
          layer.mode,
        );
        vehicle = message?.content;
      }

      const success = await centerOnVehicle(vehicle, map, TRACKING_ZOOM);

      // Once the map is zoomed on the vehicle we follow him, only recenter , no zoom changes.
      if (success === true) {
        interval = setInterval(() => {
          centerOnVehicle(layer?.trajectories?.[stopSequence.id], map);
        }, 1000);
      }
    };
    followVehicle(stopSequence.id);

    return () => {
      clearInterval(interval);
    };
  }, [isFollowing, map, layer, stopSequence, setIsTracking]);

  useEffect(() => {
    if (trainId) {
      // No animation, it's nicer for the user.
      const center = layer?.trajectories?.[trainId]?.properties?.coordinate;
      if (center) {
        map.getView().setCenter(center);
      }
    }
  }, [map, trainId, layer]);

  // Ask the station using the stationId to the Realtime API.
  useEffect(() => {
    if (!stationId || !layer?.api) {
      return;
    }
    const subscribe = async () => {
      layer?.api?.subscribe(`station ${stationId}`, ({ content }) => {
        if (content) {
          setStation(content);
        }
      });
    };
    subscribe();

    return () => {
      setStation(null);
      if (stationId) {
        layer?.api?.unsubscribe(`station ${stationId}`);
      }
    };
  }, [stationId, layer?.api, setStation]);

  // Subscribe to the stop sequence of the selected vehicle.
  useEffect(() => {
    if (!trainId || !layer?.api) {
      return;
    }
    layer.selectedVehicleId = trainId;
    layer.highlightTrajectory(trainId);
    const subscribe = async () => {
      layer?.api?.subscribeStopSequence(trainId, ({ content }) => {
        if (content) {
          const [firstStopSequence] = content;
          if (firstStopSequence) {
            setStopSequence(firstStopSequence);
          }
        }
      });
    };
    subscribe();

    return () => {
      setStopSequence(null);
      if (trainId && layer) {
        layer.api?.unsubscribeStopSequence(trainId);
        layer.selectedVehicleId = null;
        layer.vectorLayer.getSource().clear();
      }
    };
  }, [trainId, layer, layer.api, setStopSequence]);

  return null;
}

export default memo(RealtimeLayer);
