import register from "preact-custom-element";

import MobilityMap from "./MobilityMap";

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
