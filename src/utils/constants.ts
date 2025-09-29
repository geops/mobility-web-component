export const LAYER_NAME_REALTIME = "realtime";
export const LAYER_NAME_STATIONS = "stations";
export const LAYER_NAME_NOTIFICATION = "notification";
export const LAYER_NAME_LINESNETWORKPLANS = "linesnetworkplan";

export const LAYERS_NAMES = {
  linesnetworkplan: LAYER_NAME_LINESNETWORKPLANS,
  notification: LAYER_NAME_NOTIFICATION,
  realtime: LAYER_NAME_REALTIME,
  stations: LAYER_NAME_STATIONS,
};

export const LAYERS_TITLES: Record<string, string> = {
  [LAYERS_NAMES.linesnetworkplan]: "Liniennetpläne",
  [LAYERS_NAMES.notification]: "Notifications",
  [LAYERS_NAMES.realtime]: "Realtime",
  [LAYERS_NAMES.stations]: "Stations",
};

export const DEFAULT_QUERYABLE_LAYERS = Object.values(LAYERS_NAMES);

export const LAYER_PROP_IS_EXPORTING = "isExporting";
export const LAYER_PROP_IS_LOADING = "isLoading";

export const MAX_EXTENT = undefined;
