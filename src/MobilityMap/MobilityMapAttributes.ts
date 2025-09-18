//type: "checkbox" | "date" | "select" | "textfield";

import { DEFAULT_QUERYABLE_LAYERS } from "../utils/constants";

const geopsApiLink = `<a href="https://developer.geops.io/">geOps API key</a>`;
const geopsMapsApiLink = `<a href="https://developer.geops.io/apis/maps">geOps Maps API</a>`;
const geopsStopsApiLink = `<a href="https://developer.geops.io/apis/stops">geOps Stops API</a>`;
const geopsMocoApiLink = `<a href="https://geops.com/en/solution/disruption-information">geOps MOCO API</a>`;
const geopsRealtimeApiLink = `<a href="https://developer.geops.io/apis/realtime">geOps Realtime API</a>`;

export interface WebComponentAttributeDoc {
  defaultValue?: string;
  description: string;
  type?: "boolean" | undefined;
}

export type MobilityMapAttributeName =
  | "apikey"
  | "baselayer"
  | "center"
  | "embed"
  | "extent"
  | "geolocation"
  | "layers"
  | "mapsurl"
  | "maxextent"
  | "maxzoom"
  | "minzoom"
  | "mots"
  | "notification"
  | "notificationat"
  | "notificationtenant"
  | "notificationurl"
  | "permalink"
  | "queryablelayers"
  | "realtime"
  | "realtimebboxparameters"
  | "realtimetenant"
  | "realtimeurl"
  | "search"
  | "stopsurl"
  | "tenant"
  | "zoom";

export type MobilityMapAttributes = Record<
  MobilityMapAttributeName,
  WebComponentAttributeDoc
>;

const attrs: MobilityMapAttributes = {
  apikey: {
    description: `Your ${geopsApiLink}`,
  },
  baselayer: {
    defaultValue: "travic_v2",
    description: `The style's name from the ${geopsMapsApiLink}. <br/>Ex: base_dark_v2, base_bright_v2, ...`,
  },
  center: {
    defaultValue: "831634,5933959",
    description:
      "The center of the map in EPSG:3857 coordinates.<br/>Parameter required if extent is not set.",
  },
  embed: {
    defaultValue: "false",
    description:
      "Toggle the embedded navigation mode.<br/>In this mode zooming with mouse wheel is deactivated and, on touch device, you can only navigate with two finger, a warning message is displayed to warn the user.",
    type: "boolean",
  },
  extent: {
    description:
      "The map's extent in EPSG:3857 coordinates.<br/>Ex: 831634,5933959,940649,6173660 .<br/>Parameter required if center and zoom are not set.",
  },
  geolocation: {
    defaultValue: "true",
    description: "Toggle the display of the geolocation button or not.",
    type: "boolean",
  },
  layers: {
    defaultValue: DEFAULT_QUERYABLE_LAYERS,
    description:
      "A comma separated list of layers's name to make visible on load, others are hidden. If empty, all layers will be hidden except the baselayer.",
  },
  mapsurl: {
    defaultValue: "https://maps.geops.io",
    description: `The ${geopsMapsApiLink} url to use.`,
  },
  maxextent: {
    description:
      "The maximum extent of the map in EPSG:3857 coordinates.<br/>Ex: 831634,5933959,940649,6173660 .",
  },
  maxzoom: {
    description: "The maximal zoom level of the map.",
  },
  minzoom: {
    description: "The minimal zoom level of the map.",
  },
  mots: {
    description:
      "Commas separated list of mots to display on the Realtime layer.<br/>Ex: rail,bus,coach,foot,tram,subway,gondola,funicular,ferry,car .",
  },
  notification: {
    defaultValue: "false",
    description: `Add the notification layer to the map. This layer will display informations about disruptions on the network. Data comes from
        our ${geopsMocoApiLink} .`,
    type: "boolean",
  },
  notificationat: {
    description:
      "An ISO date string used to display active notification at this date in the notification layer. If not defined the current date will be used.<br/>Ex: 2025-08-01T00:00:00Z .",
  },
  notificationtenant: {
    defaultValue: "geopstest",
    description: `The ${geopsMocoApiLink} tenant to get the notification from.`,
  },
  notificationurl: {
    defaultValue: "https://moco.geops.io/api/v2/",
    description: `The ${geopsMocoApiLink} url to use.`,
  },
  permalink: {
    defaultValue: "false",
    description:
      "Update some url parameters x,y,z,layers to the current window location. These parameters are used to store the current state of the map. They will be used on page load to configure the web-component.",
    type: "boolean",
  },
  queryablelayers: {
    defaultValue: DEFAULT_QUERYABLE_LAYERS,
    description:
      "A comma separated list of layers's name. The data of these layers will be queryable by click on the map (see selectedfeature event). If empty, all layers will not be queryable.",
  },
  realtime: {
    defaultValue: "true",
    description: `Add the realtime layer to the map. Data comes from the ${geopsRealtimeApiLink} .`,
    type: "boolean",
  },
  realtimebboxparameters: {
    description:
      "A space separated list of parameters to add to the realtime BBOX request to define custom behavior.<br/>Ex: graph=XXX line_tags=XXX.",
  },
  realtimetenant: {
    description: `The ${geopsRealtimeApiLink} tenant to get the realtime data from.`,
  },
  realtimeurl: {
    defaultValue: "wss://api.geops.io/tracker-ws/v1/ws",
    description: `The ${geopsRealtimeApiLink} url to use.`,
  },
  search: {
    defaultValue: "true",
    description: "Toggle the search stops input.",
    type: "boolean",
  },
  stopsurl: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: `The ${geopsStopsApiLink} to use.`,
  },
  tenant: {
    description: `The tenant to use by default for all geOps APIs (Stops, Realtime, MOCO ...). Can be override for each API by other XXXXtenant parameters.`,
  },
  zoom: {
    defaultValue: "13",
    description: "The zoom level of the map.",
  },
};

export default attrs;
