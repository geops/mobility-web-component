import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";

register(
  MobilityMap,
  "mobility-toolbox-map",
  ["apikey", "baselayer", "center", "mots", "tenant", "zoom"],
  { shadow: true },
);
