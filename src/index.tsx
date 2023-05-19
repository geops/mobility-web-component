import register from "preact-custom-element";

import RealtimeMap from "./RealtimeMap";

register(
  RealtimeMap,
  "mobility-toolbox-map",
  ["apikey", "baselayer", "center", "mots", "tenant", "zoom"],
  { shadow: true }
);
