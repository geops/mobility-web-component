import {
  getGraphByZoom,
  RealtimeLayer as MtbRealtimeLayer,
} from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";

import centerOnVehicle from "../utils/centerOnVehicle";
import { LAYER_NAME_REALTIME } from "../utils/constants";
import getDelayColorForVehicle from "../utils/getDelayColorForVehicle";
import getDelayFontForVehicle from "../utils/getDelayFontForVehicle";
import getDelayTextForVehicle from "../utils/getDelayTextForVehicle";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeLayerOptions } from "mobility-toolbox-js/ol/layers/RealtimeLayer";
import type {
  RealtimeMot,
  RealtimeStation,
  RealtimeTrainId,
  StyleMetadataGraphs,
} from "mobility-toolbox-js/types";

const TRACKING_ZOOM = 16;

function RealtimeLayer(props: Partial<RealtimeLayerOptions>) {
  const {
    apikey,
    baseLayer,
    isFollowing,
    isTracking,
    linesNetworkPlanLayer,
    map,
    mots,
    realtimebboxparameters,
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

  const [graphByZoom, setGraphByZoom] = useState<(null | string)[]>([]);
  const [isLnpVisible, setIsLnpVisible] = useState(false);

  const layer = useMemo(() => {
    if (!apikey || !realtimeurl) {
      return null;
    }
    const lay = new MtbRealtimeLayer({
      apiKey: apikey,
      bboxParameters: realtimebboxparameters
        ?.split(" ")
        .reduce((acc, string) => {
          if (!string) {
            return acc;
          }
          const [key, value] = string.split("=");
          acc[key] = value;
          return acc;
        }, {}),
      getMotsByZoom: mots
        ? () => {
            return mots.split(",") as RealtimeMot[];
          }
        : undefined,
      isQueryable: true,
      name: LAYER_NAME_REALTIME,
      tenant,
      url: realtimeurl,
      zIndex: 1,
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

    return lay;
  }, [apikey, realtimeurl, realtimebboxparameters, mots, tenant, props]);

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
          void centerOnVehicle(layer?.trajectories?.[stopSequence.id], map);
        }, 1000);
      }
    };
    void followVehicle(stopSequence.id);

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
    layer?.api?.subscribe(`station ${stationId}`, ({ content }) => {
      if (content) {
        setStation(content as RealtimeStation);
      }
    });

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
    layer.highlightTrajectory(trainId).catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Error highlighting trajectory:", err);
    });

    layer?.api?.subscribeStopSequence(trainId, ({ content }) => {
      if (content) {
        const [firstStopSequence] = content;
        if (firstStopSequence) {
          setStopSequence(firstStopSequence);
        }
      }
    });

    return () => {
      setStopSequence(null);
      if (trainId && layer) {
        layer.api?.unsubscribeStopSequence(trainId);
        layer.selectedVehicleId = null;
        layer.vectorLayer.getSource().clear();
      }
    };
  }, [trainId, layer, layer?.api, setStopSequence]);

  // Get graphs value
  useEffect(() => {
    if (!map || !baseLayer) {
      return;
    }
    const key = map.once("rendercomplete", () => {
      const metadata = baseLayer.mapLibreMap?.getStyle()?.metadata as {
        graphs: StyleMetadataGraphs;
      };
      const tmpGraphByZoom = [];
      for (let i = 0; i < 26; i++) {
        tmpGraphByZoom.push(getGraphByZoom(i, metadata?.graphs));
      }
      setGraphByZoom(tmpGraphByZoom);
    });
    return () => {
      unByKey(key);
    };
  }, [map, baseLayer, layer]);

  // Watch lnp visibility
  useEffect(() => {
    const key = linesNetworkPlanLayer?.on("change:visible", () => {
      const visible = linesNetworkPlanLayer.getVisible();
      setIsLnpVisible(visible);
    });
    setIsLnpVisible(linesNetworkPlanLayer?.getVisible() || false);
    return () => {
      unByKey(key);
    };
  }, [linesNetworkPlanLayer]);

  // Apply graphByZoom only when lnp layer is there and visible
  useEffect(() => {
    if (!layer || !graphByZoom?.length) {
      return;
    }
    if (isLnpVisible) {
      layer.engine.graphByZoom = graphByZoom;
    } else {
      layer.engine.graphByZoom = [];
    }
    layer.engine.setBbox();
  }, [isLnpVisible, layer, graphByZoom, linesNetworkPlanLayer]);

  return null;
}

export default memo(RealtimeLayer);
