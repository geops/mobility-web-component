import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";

register(
  MobilityMap,
  "geops-mobility",
  ["apikey", "baselayer", "center", "mots", "tenant", "zoom"],
  { shadow: true },
);
