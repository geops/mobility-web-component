import { getVehiclePosition } from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";
import type { Map } from "ol";

const centerOnVehicle = async (
  vehicle: RealtimeTrajectory,
  map: Map,
  targetZoom = 0,
  isOverlayOpen = true,
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

  let center = coordinate ? [...coordinate] : null;
  if (!coordinate && geometry) {
    const { coord } = getVehiclePosition(Date.now(), vehicle, true);
    center = coord ? [...coord] : null;
  }
  if (!center) {
    return Promise.reject(new Error("No center found"));
  }
  if (isOverlayOpen) {
    // Adjust center to take in account the opened overlay.
    center[0] -= (320 / 2) * resolution; // shift right by 400px
    // console.log(center);
  }

  // Shift of 150px to the left and 50px to the top.
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
