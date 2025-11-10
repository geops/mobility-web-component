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
import getDelayTextForVehicle from "../utils/getDelayTextForVehicle";
import getMainColorForVehicle from "../utils/getMainColorForVehicle";
import getTextColorForVehicle from "../utils/getTextColorForVehicle";
import getTextFontForVehicle from "../utils/getTextFontForVehicle";
import getTextForVehicle from "../utils/getTextForVehicle";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeLayerOptions } from "mobility-toolbox-js/ol/layers/RealtimeLayer";
import type {
  RealtimeMot,
  RealtimeTrainId,
  StyleMetadataGraphs,
} from "mobility-toolbox-js/types";

const TRACKING_ZOOM = 16;

const useGraphs = window.location?.href?.includes("graphs=true");

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
      minZoom: 5, // It depends fo the radius mapping in realtimeStyleUtils
      name: LAYER_NAME_REALTIME,
      tenant,
      url: realtimeurl,
      zIndex: 1,
      ...props,
      styleOptions: {
        getColor: getMainColorForVehicle,
        getDelayColor: getDelayColorForVehicle,
        getDelayText: getDelayTextForVehicle,
        getText: getTextForVehicle,
        getTextColor: getTextColorForVehicle,
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
    if (!isFollowing || !trainId || !map || !layer) {
      return;
    }

    setIsTracking(false);

    const followVehicle = async (id: RealtimeTrainId) => {
      let vehicle = id && layer?.trajectories?.[id];

      if (!vehicle) {
        const message = await layer.api.getTrajectory(trainId, layer.mode);
        vehicle = message?.content;
      }

      const success = await centerOnVehicle(vehicle, map, TRACKING_ZOOM);

      // Once the map is zoomed on the vehicle we follow him, only recenter , no zoom changes.
      if (success === true) {
        interval = setInterval(() => {
          void centerOnVehicle(layer?.trajectories?.[trainId], map);
        }, 1000);
      }
    };
    void followVehicle(trainId);
    return () => {
      clearInterval(interval);
    };
  }, [isFollowing, map, layer, trainId, setIsTracking]);

  useEffect(() => {
    if (trainId) {
      // No animation, it's nicer for the user.
      const center = layer?.trajectories?.[trainId]?.properties?.coordinate;
      if (center) {
        map.getView().setCenter(center);
      }
    }
  }, [map, trainId, layer]);

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

    return () => {
      if (layer?.selectedVehicleId) {
        layer.api?.unsubscribeFullTrajectory(layer.selectedVehicleId);
        layer.selectedVehicleId = null;
        layer.vectorLayer.getSource().clear();
      }
    };
  }, [trainId, layer, layer?.api]);

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
    if (useGraphs && isLnpVisible) {
      layer.engine.graphByZoom = graphByZoom;
    } else {
      layer.engine.graphByZoom = [];
    }
    layer.engine.setBbox();
  }, [isLnpVisible, layer, graphByZoom, linesNetworkPlanLayer]);

  return null;
}

export default memo(RealtimeLayer);
