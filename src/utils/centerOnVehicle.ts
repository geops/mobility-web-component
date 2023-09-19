import { linear } from "ol/easing";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";

const centerOnVehicle = (map, tracker, trainId, animate) => {
  const vehicle = trainId && tracker?.trajectories?.[trainId];

  if (!vehicle) {
    console.warn("No vehicle with id " + trainId + "found.");
    return false;
  }

  let center = vehicle?.properties.coordinate;

  if (!center) {
    // If the vehicle is not on the intial extent (vehicle is null), we try to zoom first on its raw_coordinates property
    // then the layer will set the coordinate property after the first render.
    center = vehicle?.properties.raw_coordinates;
    if (center) {
      center = fromLonLat(center);
    }
  }

  if (!center) {
    return;
  }

  const view = map.getView();
  const pt = new Point(center);
  // HACK: how do we get the Routeinfos width?
  pt.translate(-150 * map.getView().getResolution(), 0);
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
