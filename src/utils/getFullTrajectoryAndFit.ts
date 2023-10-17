import { RealtimeLayer } from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Vector } from "ol/source";
import { GeoJSON } from "ol/format";
import { Extent, getCenter } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { Map } from "ol";
import { RealtimeTrainId } from "mobility-toolbox-js/types";

const getFullTrajectoryAndFit = async (
  map: Map,
  tracker: RealtimeLayer,
  trainId: RealtimeTrainId,
  targetZoom: number = 0,
) => {
  // TO IMPROVE:
  // We should be able to get a trajectory directly but it does not work because the trajectory is outside the bbox
  // see /BAHNMW-805 and TGSRVI-1126
  // So we get the full trajectory then zoom on it.

  const fullTrajectory = await tracker.api.getFullTrajectory(
    trainId,
    tracker.mode,
    tracker.generalizationLevelByZoom[targetZoom],
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
