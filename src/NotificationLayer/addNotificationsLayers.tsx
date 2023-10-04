import addSourceAndLayers from './addSourceAndLayers';

const getCurrentGraph = (mapping, zoom) => {
  const breakPoints = Object.keys(mapping).map((k) => parseFloat(k));
  const closest = breakPoints.reverse().find((bp) => bp <= Math.floor(zoom)  - 1); // - 1 due to ol zoom !== mapbox zoom
  return mapping[closest || Math.min(...breakPoints)];
};

/**
 * This function add layers in the mapbox style to show notifications lines.
 */
const addNotificationsLayers = (
  mapboxLayer,
  notifications,
  beforeLayerId,
  zoom,
  graphMapping,
) => {
  if (!mapboxLayer) {
    return;
  }
  const features = notifications.map((n) => n.features).flat();
  addSourceAndLayers(
    mapboxLayer,
    'notifications',
    {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features,
      },
    },
    [
      {
        id: 'notificationsActive',
        source: 'notifications',
        type: 'line',
        paint: {
          'line-width': 5,
          'line-color': 'rgba(255,0,0,1)',
          'line-dasharray': [2, 2],
        },
        layout: { visibility: 'visible' },
        filter: [
          'all',
          ['==', ['get', 'isActive'], true],
          ['==', ['get', 'graph'], getCurrentGraph(graphMapping, zoom)],
          ['==', ['get', 'disruption_type'], 'DISRUPTION'],
        ],
      },
    ],
    beforeLayerId,
  );
};

export default addNotificationsLayers;
