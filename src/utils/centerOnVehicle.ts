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
  targetZoom: number = 0,
) => {
  const vehicle = trainId && tracker?.trajectories?.[trainId];
  let center: Coordinate | null = null;
  const view = map.getView();
  const zoom = targetZoom || view.getZoom();
  const resolution = zoom > 0 ? view.getResolutionForZoom(zoom) : undefined;

  if (vehicle) {
    center = vehicle?.properties.coordinate;

    // if (!center) {
    //   // If the vehicle is not on the intial extent (vehicle is null), we try to zoom first on its raw_coordinates property
    //   // then the layer will set the coordinate property after the first render.
    //   center = vehicle?.properties.raw_coordinates;
    //   if (center) {
    //     center = fromLonLat(center);
    //   }
    // }
  }

  if (!center) {
    return Promise.reject();
  }

  view.cancelAnimations();
  map.renderSync(); // Rrrender the full trajectory feature, otherwise the line is cut after some time.

  // HACK: how do we get the Routeinfos width?
  const pt = new Point(center);
  pt.translate(-150 * resolution, 0);
  center = pt.getCoordinates().map((coord: number) => Math.floor(coord));

  const promise = new Promise((resolve) => {
    view.animate(
      {
        center,
        resolution,
        duration: 1000,
        easing: linear,
      },
      (success) => {
        resolve(success);
      },
    );
  });
  return promise;
};

export default centerOnVehicle;
