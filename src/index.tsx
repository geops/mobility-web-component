import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";
import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";
import MobilitySearch, { MobilitySearchAttributes } from "./MobilitySearch";

register(MobilityMap, "geops-mobility", Object.keys(MobilityMapAttributes), {
  mode: "open",
  shadow: true,
});

register(
  MobilitySearch,
  "geops-mobility-search",
  Object.keys(MobilitySearchAttributes),
  {
    mode: "open",
    shadow: true,
  },
);
