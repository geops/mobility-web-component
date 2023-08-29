import register from "preact-custom-element";

import RealtimeMap from "./RealtimeMap";
import BasicMap from "./BasicMap";
import NotificationMap from "./NotificationMap";

register(
  RealtimeMap,
  "mobility-toolbox-realtime-map",
  ["apikey", "baselayer", "center", "mots", "tenant", "zoom"],
  { shadow: true }
);

register(
  BasicMap,
  "mobility-toolbox-basic-map",
  ["apikey", "baselayer", "center", "zoom", "map"],
  { shadow: true }
);

register(
  NotificationMap,
  "mobility-toolbox-notification-map",
  ["apikey", "baselayer", "center", "zoom", "map"],
  { shadow: true }
);

