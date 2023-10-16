import register from "preact-custom-element";

import MobilityToolboxMap from "./MobilityToolboxMap";

register(
  MobilityToolboxMap,
  "mobility-toolbox-map",
  [
    "apikey",
    "baselayer",
    "center",
    "mots",
    "tenant",
    "zoom",
    "type",
    "notificationurl",
    "notificationbeforelayerid",
    "realtimeurl",
    "maxzoom",
    "minzoom",
  ],
  { shadow: true },
);
