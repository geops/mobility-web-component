import { GeoJSON } from "ol/format";
import { Vector } from "ol/source";

import type { RealtimeLayer } from "mobility-toolbox-js/ol";
import type { RealtimeTrainId } from "mobility-toolbox-js/types";
import type { Map } from "ol";

const getFullTrajectoryAndFit = async (
  map: Map,
  realtimeLayer: RealtimeLayer,
  trainId: RealtimeTrainId,
  targetZoom = 0,
) => {
  // TO IMPROVE:
  // We should be able to get a trajectory directly but it does not work because the trajectory is outside the bbox
  // see /BAHNMW-805 and TGSRVI-1126
  // So we get the full trajectory then zoom on it.

  const fullTrajectory = await realtimeLayer.api.getFullTrajectory(
    trainId,
    realtimeLayer.mode,
    realtimeLayer.engine.generalizationLevelByZoom[targetZoom],
  );
  if (fullTrajectory?.content?.features?.length) {
    const extent = new Vector({
      features: new GeoJSON().readFeatures(fullTrajectory.content),
    }).getExtent();

    const promise = new Promise((resolve) => {
      map.getView().fit(extent, {
        callback: (success) => {
          resolve(success);
        },
      });
    });
    return promise;
  }
  return Promise.resolve(false);
};

export default getFullTrajectoryAndFit;
