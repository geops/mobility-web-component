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

const centerOnVehicle = async (
  map: Map,
  tracker: RealtimeLayer,
  trainId: RealtimeTrainId,
  animate: boolean = false,
) => {
  const vehicle = trainId && tracker?.trajectories?.[trainId];
  let center: Coordinate | null = null;

  if (vehicle) {
    center = vehicle?.properties.coordinate;

    if (!center) {
      // If the vehicle is not on the intial extent (vehicle is null), we try to zoom first on its raw_coordinates property
      // then the layer will set the coordinate property after the first render.
      center = vehicle?.properties.raw_coordinates;
      if (center) {
        center = fromLonLat(center);
      }
    }
  } else if (tracker) {
    // TO IMPROVE:
    // We should be able to get a trajectory directly but it does not work because the trajectory is outside the bbox
    // see /BAHNMW-805 and TGSRVI-1126
    // So we get the full trajectory then zoom on it.
    const fullTrajectory = await tracker.api.getFullTrajectory(
      trainId,
      tracker.mode,
      tracker.generalizationLevelByZoom[map.getView().getZoom() || 0],
    );
    if (fullTrajectory?.content?.features?.length) {
      const extent = new Vector({
        features: new GeoJSON().readFeatures(fullTrajectory.content),
      }).getExtent();
      map.getView().fit(extent, { duration: 500 });
      return;
    }
  }

  if (!center) {
    return;
  }

  const view = map.getView();
  const pt = new Point(center);
  // HACK: how do we get the Routeinfos width?
  pt.translate(-150 * (map.getView().getResolution() || 0), 0);
  center = pt.getCoordinates().map((coord: number) => Math.floor(coord));
  if (view && animate) {
    const options = {
      center,
      duration: 500,
      easing: linear,
    };

    view.animate(options);
  } else if (view) {
    // wait for map to render th
    view.cancelAnimations();
    view.animate({
      center,
      duration: 1000,
      easing: linear,
    });
  }
};

export default centerOnVehicle;
