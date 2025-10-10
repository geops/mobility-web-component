import { MaplibreStyleLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import {
  LNP_GEOPS_FILTER_HIGHLIGHT,
  LNP_LINE_ID_PROP,
} from "../utils/constants";
import highlightLinesNetworkPlan from "../utils/highlightLinesNetworkPlan";
import useMapContext from "../utils/hooks/useMapContext";

import type { MaplibreStyleLayerOptions } from "mobility-toolbox-js/ol/layers/MaplibreStyleLayer";

function LinesNetworkPlanLayerHighlight(props: MaplibreStyleLayerOptions) {
  const { baseLayer, featuresInfos, linesNetworkPlanLayer, map } =
    useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MaplibreStyleLayer({
      layersFilter: ({ metadata }) => {
        return metadata?.["geops.filter"]?.startsWith(
          LNP_GEOPS_FILTER_HIGHLIGHT,
        );
      },
      maplibreLayer: baseLayer,
      ...(props || {}),
    });
  }, [baseLayer, props]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }

    map.addLayer(layer);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  useEffect(() => {
    if (!layer || !featuresInfos || !linesNetworkPlanLayer) {
      return;
    }
    const features =
      featuresInfos.find((featuresInfo) => {
        return featuresInfo.layer === linesNetworkPlanLayer;
      })?.features || [];

    if (features?.length) {
      layer.setVisible(true);
    } else {
      layer.setVisible(false);
    }
    const ids = [
      ...new Set(
        (features || []).map((f) => {
          return f.get(LNP_LINE_ID_PROP) as string;
        }),
      ),
    ];

    try {
      highlightLinesNetworkPlan(ids, baseLayer);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error setting filter for highlight layer", e);
    }

    return () => {
      layer?.setVisible(false);
      // Reset the filter
      highlightLinesNetworkPlan(undefined, baseLayer);
    };
  }, [
    baseLayer,
    baseLayer?.mapLibreMap,
    featuresInfos,
    layer,
    linesNetworkPlanLayer,
  ]);
  return null;
}

export default memo(LinesNetworkPlanLayerHighlight);
