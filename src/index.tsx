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
    "mots",
    "notification",
    "notificationat",
    "notificationurl",
    "notificationbeforelayerid",
    "realtime",
    "realtimeUrl",
    "tenant",
    "zoom",
  ],
  { shadow: true },
);
