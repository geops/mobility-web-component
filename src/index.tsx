import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";
import MobilitySearch from "./StopsSearch";

register(
  MobilityMap,
  "geops-mobility",
  [
    "apikey",
    "baselayer",
    "center",
    "geolocation",
    "mapsurl",
    "mots",
    "notification",
    "notificationat",
    "notificationurl",
    "notificationbeforelayerid",
    "realtime",
    "realtimeUrl",
    "tenant",
    "zoom",
    "permalink",
  ],
  { shadow: true },
);

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
    shadow: true,
  },
);
