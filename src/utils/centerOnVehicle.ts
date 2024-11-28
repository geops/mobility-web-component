import { getVehiclePosition } from "mobility-toolbox-js/ol";
import { RealtimeTrajectory } from "mobility-toolbox-js/types";
import { Map } from "ol";
import { linear } from "ol/easing";

const centerOnVehicle = async (
  vehicle: RealtimeTrajectory,
  map: Map,
  targetZoom = 0,
) => {
  if (!vehicle) {
    return Promise.reject();
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
    return Promise.reject();
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
