import addSourceAndLayers from "./addSourceAndLayers";

/**
 * This function add layers in the mapbox style to show notifications lines.
 */
const addNotificationsLayers = (
  mapboxLayer,
  notifications,
  beforeLayerId,
) => {
  if (!mapboxLayer) {
    console.log(mapboxLayer);
    return;
  }

  const features = notifications.map((n) => n.features).flat();
  addSourceAndLayers(
    mapboxLayer,
    "notifications",
    {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
    },
    [
      {
        id: "notificationsActive",
        source: "notifications",
        type: "line",
        paint: {
          "line-width": 2.5,
          "line-color": "rgba(255,0,0,1)",
          "line-dasharray": [2, 2],
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DISRUPTION"],
        ],
      },
    ],
    beforeLayerId,
  );
};

export default addNotificationsLayers;
