import { LNP_LAYER_ID_HIGHLIGHT, LNP_LINE_ID_PROP } from "./constants";

import type { MaplibreLayer } from "mobility-toolbox-js/ol";

function highlightLinesNetworkPlan(
  ids: number[] | string[] = [0],
  baseLayer: MaplibreLayer,
) {
  try {
    const styleLayer = baseLayer?.mapLibreMap?.getLayer(LNP_LAYER_ID_HIGHLIGHT);
    if (styleLayer) {
      baseLayer?.mapLibreMap?.setFilter(styleLayer.id, [
        "match",
        ["get", LNP_LINE_ID_PROP],
        ids,
        true,
        false,
      ]);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Error setting filter for highlight layer", e);
  }
}
export default highlightLinesNetworkPlan;
