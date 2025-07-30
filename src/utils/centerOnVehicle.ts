import { getVehiclePosition } from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";
import type { Map } from "ol";

const centerOnVehicle = async (
  vehicle: RealtimeTrajectory,
  map: Map,
  targetZoom = 0,
) => {
  if (!vehicle) {
    return Promise.reject(new Error("No vehicle provided"));
  }

  const {
    geometry,
    properties: { coordinate },
  } = vehicle;
  const view = map.getView();
  const zoom = targetZoom || view.getZoom();
  const resolution = zoom > 0 ? view.getResolutionForZoom(zoom) : undefined;

  let center = coordinate;
  if (!center && geometry) {
    const { coord } = getVehiclePosition(Date.now(), vehicle, true);
    center = coord as [number, number];
  }
  if (!center) {
    return Promise.reject(new Error("No center found"));
  }

  view.cancelAnimations();

  const promise = new Promise((resolve) => {
    view.animate(
      {
        center,
        duration: 1000,
        easing: linear,
        resolution,
      },
      (success) => {
        resolve(success);
      },
    );
  });
  return promise;
};

export default centerOnVehicle;
