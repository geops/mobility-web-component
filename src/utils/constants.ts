export const LAYER_NAME_REALTIME = "realtime";
export const LAYER_NAME_STATIONS = "stations";
export const LAYER_NAME_NOTIFICATIONS = "notifications";
export const LAYER_NAME_LINESNETWORKPLAN = "linesnetworkplan";

export const LAYERS_NAMES = {
  linesnetworkplan: LAYER_NAME_LINESNETWORKPLAN,
  notifications: LAYER_NAME_NOTIFICATIONS,
  realtime: LAYER_NAME_REALTIME,
  stations: LAYER_NAME_STATIONS,
};

export const LAYERS_TITLES: Record<string, string> = {
  linesnetworkplan: "Liniennetzpläne",
  notifications: "Notifications",
  realtime: "Realtime",
  stations: "Stations",
};

export const DEFAULT_QUERYABLE_LAYERS = Object.values(LAYERS_NAMES);

export const LAYER_PROP_IS_EXPORTING = "isExporting";
export const LAYER_PROP_IS_LOADING = "isLoading";

export const MAX_EXTENT = undefined;
