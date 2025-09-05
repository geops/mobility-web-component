// This file contains what we need to build the documentation in the index.html file

import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";

if (typeof window !== "undefined") {
  // @ts-expect-error it's wanted
  window.MobilityMapAttributes = MobilityMapAttributes;
}

export default { MobilityMapAttributes };
