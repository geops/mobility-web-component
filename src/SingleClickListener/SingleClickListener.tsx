import { unByKey } from "ol/Observable";
import { useCallback, useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type { Feature, MapBrowserEvent } from "ol";

function SingleClickListener() {
  const {
    map,
    realtimeLayer,
    setStationId,
    setTrainId,
    stationId,
    stationsLayer,
    tenant,
    trainId,
  } = useMapContext();

  const onPointerMove = useCallback(
    (evt: MapBrowserEvent<PointerEvent>) => {
      const [realtimeFeature] = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l === realtimeLayer;
        },
      });
      realtimeLayer?.highlight(realtimeFeature as Feature);

      const stationsFeatures = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l === stationsLayer;
        },
      });

      const [stationFeature] = stationsFeatures.filter((feat) => {
        return feat.get("tralis_network")?.includes(tenant);
      });

      evt.map.getTargetElement().style.cursor =
        realtimeFeature || stationFeature ? "pointer" : "default";
    },
    [realtimeLayer, stationsLayer, tenant],
  );

  const onSingleClick = useCallback(
    (evt: MapBrowserEvent<PointerEvent>) => {
      const [realtimeFeature] = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l === realtimeLayer;
        },
      });

      const stationsFeatures = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l === stationsLayer;
        },
      });
      const [stationFeature] = stationsFeatures.filter((feat) => {
        return feat.get("tralis_network")?.includes(tenant);
      });

      const newStationId = stationFeature?.get("uid");

      const newTrainId = realtimeFeature?.get("train_id");

      if (newStationId && stationId !== newStationId) {
        setStationId(newStationId);
        setTrainId(null);
      } else if (newTrainId && newTrainId !== trainId) {
        setTrainId(realtimeFeature.get("train_id"));
        setStationId(null);
      } else {
        setTrainId(null);
        setStationId(null);
      }
    },
    [
      stationId,
      trainId,
      realtimeLayer,
      stationsLayer,
      tenant,
      setStationId,
      setTrainId,
    ],
  );

  useEffect(() => {
    const key = map?.on("singleclick", onSingleClick);
    return () => {
      unByKey(key);
    };
  }, [map, onSingleClick]);

  useEffect(() => {
    const key = map?.on("pointermove", onPointerMove);
    return () => {
      unByKey(key);
    };
  }, [map, onPointerMove]);

  return null;
}
export default SingleClickListener;
