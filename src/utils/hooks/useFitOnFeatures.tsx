import { GeoJSON } from "ol/format";
import { Vector } from "ol/source";
import { useEffect, useRef } from "preact/hooks";

import { FIT_ON_FEATURES_MAX_ZOOM_POINT } from "../constants";

import useMapContext from "./useMapContext";

import type { Feature, Map } from "ol";
import type { GeoJSONFeature } from "ol/format/GeoJSON";
const geojson = new GeoJSON();

export type FitOnFeatures = (
  features: (Feature | GeoJSONFeature)[],
  map?: Map,
) => void;

const useFitOnFeatures = () => {
  const { isOverlayOpen, map: contextMap } = useMapContext();

  const isOverlayOpenRef = useRef(isOverlayOpen);
  const fitOnFeatures = useRef<FitOnFeatures>();

  useEffect(() => {
    isOverlayOpenRef.current = isOverlayOpen;
  }, [isOverlayOpen]);

  useEffect(() => {
    fitOnFeatures.current = (
      features: (Feature | GeoJSONFeature)[],
      map?: Map,
    ) => {
      if ((!map && !contextMap) || !features?.length) {
        return;
      }
      let feats = features as Feature[];

      // Convert to ol features if GeoJSON
      const geoJSONFeature = features?.[0] as GeoJSONFeature;
      if (geoJSONFeature?.properties && geoJSONFeature?.type === "Feature") {
        // Single feature case
        feats = geojson.readFeatures(
          {
            features,
            type: "FeatureCollection",
          },
          { featureProjection: "EPSG:3857" },
        );
      }

      const mapToUse = map || contextMap;
      const extent = new Vector({ features: feats }).getExtent();
      mapToUse.getView().fit(extent, {
        duration: 500,
        maxZoom:
          extent[0] === extent[2] || extent[1] === extent[3]
            ? FIT_ON_FEATURES_MAX_ZOOM_POINT
            : undefined,
        padding: [100, 100, 100, isOverlayOpenRef.current ? 400 : 100],
      });
      return () => {
        mapToUse?.getView().cancelAnimations();
      };
    };
  }, [contextMap]);

  return fitOnFeatures;
};

export default useFitOnFeatures;
