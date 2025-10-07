import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";
import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";
import MobilitySearch, { MobilitySearchAttributes } from "./MobilitySearch";

import type { MobilityMapAttributeName } from "./MobilityMap/MobilityMapAttributes";
import type { MobilitySearchAttributeName } from "./MobilitySearch/MobilitySearchAttributes";

register(
  MobilityMap,
  "geops-mobility",
  Object.keys(MobilityMapAttributes) as MobilityMapAttributeName[],
  {
    mode: "open",
    shadow: true,
  },
);

register(
  MobilitySearch,
  "geops-mobility-search",
  Object.keys(MobilitySearchAttributes) as MobilitySearchAttributeName[],
  {
    mode: "open",
    shadow: true,
  },
);
