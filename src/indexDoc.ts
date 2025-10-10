// This file contains what we need to build the documentation in the index.html file

import MobilityMapAttributes from "./MobilityMap/MobilityMapAttributes";
import MobilityMapEvents from "./MobilityMap/MobilityMapEvents";
import MobilitySearchAttributes from "./MobilitySearch/MobilitySearchAttributes";
import MobilitySearchEvents from "./MobilitySearch/MobilitySearchEvents";

declare global {
  interface Window {
    MobilityMapAttributes?: typeof MobilityMapAttributes;
    MobilityMapEvents?: typeof MobilityMapEvents;
    MobilitySearchAttributes?: typeof MobilitySearchAttributes;
    MobilitySearchEvents?: typeof MobilitySearchEvents;
  }
}

if (typeof window !== "undefined") {
  window.MobilityMapAttributes = MobilityMapAttributes;
  window.MobilityMapEvents = MobilityMapEvents;

  window.MobilitySearchAttributes = MobilitySearchAttributes;
  window.MobilitySearchEvents = MobilitySearchEvents;
}

export default {
  MobilityMapAttributes,
  MobilityMapEvents,
  MobilitySearchAttributes,
  MobilitySearchEvents,
};
