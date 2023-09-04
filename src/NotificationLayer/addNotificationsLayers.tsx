import addSourceAndLayers from "./addSourceAndLayers";

const getCurrentGraph = (zoom: number, mode: string) => {
  const modePrefix = mode === 'schematic' ? 'schema' : 'topo'
  if (zoom > 12) {
    return 'osm'
  }
  if (zoom < 5) {
    return `np_${modePrefix}5`
  }
  return `np_${modePrefix}${parseInt(`${zoom}`, 10) - 1}`
}

/**
 * This function add layers in the mapbox style to show notifications lines.
 */
const addNotificationsLayers = (
  mapboxLayer,
  notifications,
  beforeLayerId,
  zoom,
  mode,
) => {
  if (!mapboxLayer) {
    console.log(mapboxLayer);
    return;
  }

  
  const features = notifications.map((n) => n.features).flat();
  const currentGraph = getCurrentGraph(zoom, mode);
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
          "line-width": 5,
          "line-color": "rgba(255,0,0,1)",
          "line-dasharray": [2, 2],
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "graph"], currentGraph],
          ["==", ["get", "disruption_type"], "DISRUPTION"],
        ],
      },
    ],
    beforeLayerId,
  );
};

export default addNotificationsLayers;
