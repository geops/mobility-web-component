// This file contains what we need to build the documentation in the index.html file

import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";
import MobilitySearchAttributes from "./MobilitySearch/MobilitySearchAttributes";

if (typeof window !== "undefined") {
  // @ts-expect-error it's wanted
  window.MobilityMapAttributes = MobilityMapAttributes;
  // @ts-expect-error it's wanted
  window.MobilitySearchAttributes = MobilitySearchAttributes;
}

export default { MobilityMapAttributes, MobilitySearchAttributes };
