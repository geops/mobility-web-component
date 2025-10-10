import MobilityMapEvents from "../MobilityMap/MobilityMapEvents";

import type { WebComponentEventDoc } from "../MobilityMap/MobilityMapEvents";

export type MobilitySearchEventName = "mwc:attribute" | "mwc:stopssearchselect";

export type MobilitySearchAttributes = Record<
  MobilitySearchEventName,
  WebComponentEventDoc
>;

const attrs: MobilitySearchAttributes = {
  "mwc:attribute": MobilityMapEvents["mwc:attribute"],
  "mwc:stopssearchselect": {
    description:
      "Event fired when a stop is selected in the stops search results. The event data contains the selected stop.",
    public: true,
  },
};

export default attrs;
