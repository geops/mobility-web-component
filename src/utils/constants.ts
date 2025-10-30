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
export const MAX_EXTENT_4326 = undefined;

export const EXPORT_PREFIX = "mwc";

// Lines network plans

// The property used as identifier for a line, this id is used as key in the geops.lnp.lines metadata of the network plan source.
// See https://maps.test.geops.io/data/network_plans_trenord.json style for an example.
export const LNP_LINE_ID_PROP = "original_line_id";

// LNP data source id in the style
export const LNP_SOURCE_ID = "network_plans";

// Metadata key in the lnp data source
export const LNP_MD_LINES = "geops.lnp.lines";
export const LNP_MD_STOPS = "geops.lnp.stops";

// LNP style metadata filter to use to show/hide highlight
export const LNP_GEOPS_FILTER_HIGHLIGHT = "highlightnetzplan";

// LNP style layer id where the dynamic filtering will apply
export const LNP_LAYER_ID_HIGHLIGHT = "netzplan_highlight_trip";
