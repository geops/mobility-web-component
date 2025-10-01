export const LAYER_NAME_REALTIME = "realtime";
export const LAYER_NAME_STATIONS = "stations";
export const LAYER_NAME_NOTIFICATIONS = "notifications";
export const LAYER_NAME_LINESNETWORKPLANS = "linesnetworkplan";

export const LAYERS_NAMES = {
  linesnetworkplan: LAYER_NAME_LINESNETWORKPLANS,
  notifications: LAYER_NAME_NOTIFICATIONS,
  realtime: LAYER_NAME_REALTIME,
  stations: LAYER_NAME_STATIONS,
};

export const LAYERS_TITLES: Record<string, string> = {
  [LAYERS_NAMES.linesnetworkplan]: "Liniennetzpläne",
  [LAYERS_NAMES.notifications]: "Notifications",
  [LAYERS_NAMES.realtime]: "Realtime",
  [LAYERS_NAMES.stations]: "Stations",
};

export const DEFAULT_QUERYABLE_LAYERS = Object.values(LAYERS_NAMES);

export const LAYER_PROP_IS_EXPORTING = "isExporting";
export const LAYER_PROP_IS_LOADING = "isLoading";

export const MAX_EXTENT = undefined;
