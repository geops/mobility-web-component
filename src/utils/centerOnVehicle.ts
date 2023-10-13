import { getVehiclePosition } from "mobility-toolbox-js/ol";
import { linear } from "ol/easing";
import { Map } from "ol";
import { RealtimeTrajectory } from "mobility-toolbox-js/types";

const centerOnVehicle = async (
  vehicle: RealtimeTrajectory,
  map: Map,
  targetZoom: number = 0,
) => {
  if (!vehicle) {
    return Promise.reject();
  }

  const {
    // @ts-ignore
    properties: { coordinate },
    geometry,
  } = vehicle;
  const view = map.getView();
  const zoom = targetZoom || view.getZoom();
  const resolution = zoom > 0 ? view.getResolutionForZoom(zoom) : undefined;

  let center = coordinate;
  if (!center && geometry) {
    const { coord } = getVehiclePosition(Date.now(), vehicle, true);
    center = coord;
  }
  if (!center) {
    return Promise.reject();
  }

  view.cancelAnimations();
  map.renderSync(); // Rerender the full trajectory feature, otherwise the line is cut after some time.

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
