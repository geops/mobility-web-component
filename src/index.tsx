import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";
import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";
import MobilitySearch from "./StopsSearch";

register(MobilityMap, "geops-mobility", Object.keys(MobilityMapAttributes), {
  mode: "open",
  shadow: true,
});

register(
  MobilitySearch,
  "geops-mobility-search",
  [
    "apikey",
    "bbox",
    "countrycode",
    "event",
    "field",
    "limit",
    "mots",
    "onselect",
    "params",
    "prefagencies",
    "reflocation",
    "url",
  ],
  {
    mode: "open",
    shadow: true,
  },
);
