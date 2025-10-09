export const LAYER_NAME_REALTIME = "realtime";
export const LAYER_NAME_STATIONS = "stations";
export const LAYER_NAME_NOTIFICATIONS = "notifications";
export const LAYER_NAME_LINESNETWORKPLAN = "linesnetworkplan";
export const LAYER_NAME_MAPSET = "mapset";

export const LAYERS_NAMES = {
  linesnetworkplan: LAYER_NAME_LINESNETWORKPLAN,
  mapset: LAYER_NAME_MAPSET,
  notifications: LAYER_NAME_NOTIFICATIONS,
  realtime: LAYER_NAME_REALTIME,
  stations: LAYER_NAME_STATIONS,
};

export const DEFAULT_VISIBLE_LAYERS = Object.values(LAYERS_NAMES);

export const DEFAULT_QUERYABLE_LAYERS = Object.values([
  LAYER_NAME_LINESNETWORKPLAN,
  LAYER_NAME_NOTIFICATIONS,
  LAYER_NAME_STATIONS,
  LAYER_NAME_REALTIME,
]);

// Order of the first level
export const LAYER_TREE_ORDER = [
  LAYER_NAME_REALTIME,
  LAYER_NAME_STATIONS,
  LAYER_NAME_LINESNETWORKPLAN,
  LAYER_NAME_MAPSET,
  LAYER_NAME_NOTIFICATIONS,
];

export const LAYER_PROP_IS_EXPORTING = "isExporting";
export const LAYER_PROP_IS_LOADING = "isLoading";

export const MAX_EXTENT = undefined;

export const EXPORT_PREFIX = "mwc";
