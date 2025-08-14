import { GeoJSON } from "ol/format";
import { unByKey } from "ol/Observable";
import { useCallback, useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";
import MobilityEvent from "../utils/MobilityEvent";

import type { Feature, MapBrowserEvent } from "ol";
import type BaseLayer from "ol/layer/Base";

const geojson = new GeoJSON();

function SingleClickListener({
  eventName = "mwc:selectedfeature",
  // layers = null,
}: {
  eventName?: string;
  layers?: BaseLayer[];
}) {
  const {
    map,
    realtimeLayer,
    selectedFeature,
    setSelectedFeature,
    setSelectedFeatures,
    setStationId,
    setTrainId,
    stationId,
    stationsLayer,
    tenant,
    trainId,
  } = useMapContext();

  // Send the selectedFeature to the parent window
  useEffect(() => {
    if (!map) {
      return;
    }

    map.getTargetElement().dispatchEvent(
      new MobilityEvent(eventName, {
        feature: selectedFeature
          ? geojson.writeFeatureObject(selectedFeature)
          : null,
      }),
    );
  }, [eventName, map, selectedFeature]);

  const onPointerMove = useCallback(
    (evt: MapBrowserEvent<PointerEvent>) => {
      const [realtimeFeature] = evt.map.getFeaturesAtPixel(evt.pixel, {
        hitTolerance: 5,
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

      // Send all the features under the cursor
      const features = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l.get("isQueryable");
        },
      }) as Feature[];

      evt.map.getTargetElement().style.cursor =
        realtimeFeature || stationFeature || features?.length
          ? "pointer"
          : "default";
    },
    [realtimeLayer, stationsLayer, tenant],
  );

  const onSingleClick = useCallback(
    (evt: MapBrowserEvent<PointerEvent>) => {
      const [realtimeFeature] = evt.map.getFeaturesAtPixel(evt.pixel, {
        hitTolerance: 5,
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

      // Send all the features under the cursor
      const features = evt.map.getFeaturesAtPixel(evt.pixel, {
        layerFilter: (l) => {
          return l.get("isQueryable");
        },
      }) as Feature[];

      // evt.map.getTargetElement().dispatchEvent(
      //   new MobilityEvent("singleclick", {
      //     ...evt,
      //     features: geojson.writeFeaturesObject(features),
      //     lonlat: toLonLat(evt.coordinate),
      //   }),
      // );

      if (newStationId || newTrainId || !features.length) {
        setSelectedFeature(null);
        setSelectedFeatures([]);
      } else {
        setSelectedFeatures(features);
        setSelectedFeature(features[0]);
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
      setSelectedFeature,
      setSelectedFeatures,
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
