import addSourceAndLayers from "./addSourceAndLayers";

/**
 * This function add layers in the mapbox style to show notifications lines.
 */
const addNotificationsLayers = (
  mapboxLayer,
  notifications,
  beforeLayerId,
  beforeLayerIdForDeviation,
  { lineWidth, lineWidthBackground },
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
        id: "notificationsActiveBackground",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#eaa1aa",
          "line-width": lineWidthBackground,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DISRUPTION"],
        ],
      },
      {
        id: "notificationsActive",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#fc0009",
          "line-dasharray": [1, 1],
          "line-width": lineWidth,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DISRUPTION"],
        ],
      },
      {
        id: "notificationsActiveRailReplacementBackground",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#c688be",
          "line-width": lineWidthBackground,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DISRUPTION_RAIL_REPLACEMENT"],
        ],
      },
      {
        id: "notificationsActiveRailReplacement",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#8400a8",
          "line-dasharray": [1, 1],
          "line-width": lineWidth,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DISRUPTION_RAIL_REPLACEMENT"],
        ],
      },
      {
        id: "notificationsActiveDeviation",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#FFFFFF",
          "line-opacity": 0.5,
          "line-dasharray": [1, 1],
          "line-width": lineWidth,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DEVIATION"],
        ],
      },
      {
        id: "notificationsActiveDeviationStops",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#FFFFFF",
          "line-opacity": 0.5,
          "line-dasharray": [1, 1],
          "line-width": lineWidth,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DEVIATION_STOPS"],
        ],
      },
      {
        id: "notificationsFuture",
        source: "notifications",
        type: "line",
        paint: { "line-width": 0 },
        filter: ["==", ["get", "isActive"], false],
      },
    ],
    beforeLayerId,
  );

  addSourceAndLayers(
    mapboxLayer,
    null,
    null,
    [
      {
        id: "notificationsActiveDeviationBackground",
        source: "notifications",
        type: "line",
        paint: {
          "line-color": "#eaa1aa",
          "line-width": lineWidthBackground,
        },
        layout: { visibility: "visible" },
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "disruption_type"], "DEVIATION"],
        ],
      },
    ],
    beforeLayerIdForDeviation,
  );
};

export default addNotificationsLayers;
