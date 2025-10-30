//type: "checkbox" | "date" | "select" | "textfield";

import {
  DEFAULT_QUERYABLE_LAYERS,
  DEFAULT_VISIBLE_LAYERS,
  LAYERS_NAMES,
} from "../utils/constants";

const geopsApiLink = `<a href="https://developer.geops.io/">geOps API key</a>`;
const geopsMapsApiLink = `<a href="https://developer.geops.io/apis/maps">geOps Maps API</a>`;
const geopsStopsApiLink = `<a href="https://developer.geops.io/apis/stops">geOps Stops API</a>`;
const geopsMocoApiLink = `<a href="https://geops.com/en/solution/disruption-information">geOps MOCO API</a>`;
const geopsMapsetApiLink = `<a href="https://geops.com/en/solution/mapset">geOps Mapset API</a>`;
const geopsRealtimeApiLink = `<a href="https://developer.geops.io/apis/realtime">geOps Realtime API</a>`;

export interface WebComponentAttributeDoc {
  defaultValue?: string;
  description: string;
  public?: boolean;
  type?: "boolean" | undefined;
}

export type MobilityMapAttributeName =
  | "apikey"
  | "baselayer"
  | "center"
  | "details"
  | "embed"
  | "extent"
  | "geolocation"
  | "lang"
  | "layers"
  | "layersconfig"
  | "layertree"
  | "lnp"
  | "lnpid"
  | "mapset"
  | "mapsetplanid"
  | "mapsettags"
  | "mapsettenants"
  | "mapsettimestamp"
  | "mapseturl"
  | "mapsurl"
  | "maxextent"
  | "maxzoom"
  | "minzoom"
  | "mots"
  | "notification"
  | "notificationat"
  | "notificationid"
  | "notificationtenant"
  | "notificationurl"
  | "permalink"
  | "permalinktemplate"
  | "print"
  | "queryablelayers"
  | "realtime"
  | "realtimebboxparameters"
  | "realtimetenant"
  | "realtimeurl"
  | "search"
  | "share"
  | "stationid"
  | "stopsurl"
  | "tenant"
  | "toolbar"
  | "trainid"
  | "zoom";

export type MobilityMapAttributes = Record<
  MobilityMapAttributeName,
  WebComponentAttributeDoc
>;

const attrs: MobilityMapAttributes = {
  apikey: {
    description: `Your ${geopsApiLink}`,
    public: true,
  },
  baselayer: {
    defaultValue: "travic_v2",
    description: `The style's name from the ${geopsMapsApiLink}. <br/>Ex: base_dark_v2, base_bright_v2, ...`,
    public: true,
  },
  center: {
    defaultValue: "831634,5933959",
    description:
      "The center of the map in EPSG:3857 coordinates.<br/>Parameter required if extent is not set.",
    public: true,
  },
  details: {
    defaultValue: "true",
    description:
      "When a feature of a queryable layer is clicked, it displays informations about it.",
    public: true,
    type: "boolean",
  },
  embed: {
    defaultValue: "false",
    description:
      "Toggle the embedded navigation mode.<br/>In this mode zooming with mouse wheel is deactivated and, on touch device, you can only navigate with two finger, a warning message is displayed to warn the user.",
    public: true,
    type: "boolean",
  },
  extent: {
    description:
      "The map's extent in EPSG:3857 coordinates.<br/>Ex: 831634,5933959,940649,6173660 .<br/>Parameter required if center and zoom are not set.",
    public: true,
  },
  geolocation: {
    defaultValue: "true",
    description: "Toggle the display of the geolocation button or not.",
    public: true,
    type: "boolean",
  },
  lang: {
    defaultValue: "en",
    description:
      "The language to use for the map. Supported languages are : de, en, fr, it.",
    public: true,
  },
  layers: {
    defaultValue: DEFAULT_VISIBLE_LAYERS.toString(),
    description: `A comma separated list of layers's name to make visible on load, others are hidden. If empty, all layers will be hidden except the baselayer.<br/>Layers available are ${Object.values(LAYERS_NAMES).join(", ")}.`,
    public: true,
  },
  layersconfig: {
    description: `A JSON string to configure the layers and other components associated to it.<br/>
       The layers available are : ${Object.values(LAYERS_NAMES).toString()}.<br/>
       Definition for a layer :
<pre style="font-size: 12px; overflow: auto;">
{
  "${LAYERS_NAMES.linesnetworkplan}": {
    "featurelink": {
      "href": "https://www.mysite.de/my-line/?id={{id}}"
    }
  },
  "${LAYERS_NAMES.notifications}": {
    "link": {
      "href": "https://moco.geops.io/situation/{{id}}",
      "show": true,
      "text": "Zu MOCO"
    },
    "title": "Notifications"
}
</pre>
<br/>
where:
<ul style="list-style-type: disc; padding-left: 20px;">
  <li><i>link</i> defined a external link displayed at the bottom of the detail view</li>
    <ul style="list-style-type: disc; padding-left: 40px;">
      <li><i>href</i> is the target of the link. The <i>href</i> can be template, for example for the meldungen layer you can use {{id}} to insert the id of the notification in the url.</li>
      <li><i>text</i> is the text display as a link</li>
      <li><i>show</i> show/hide the link in the details view</li>
    </ul>
  <li><i>featurelink</i> defined a external link used when you click on single feature in detail view</li>
    <ul style="list-style-type: disc; padding-left: 40px;">
      <li><i>href</i> is the target of the link. The <i>href</i> can be template, for example for the meldungen layer you can use {{id}} to insert the id of the notification in the url.</li>
    </ul>
  <li><i>title</i> is the title of the layer used in the details view header and in the layer tree, if not defined the layer name will be used.</li>
</ul>`,
    public: true,
  },
  layertree: {
    defaultValue: "true",
    description: "Show/hide the layers tree button in the toolbar.",
    public: true,
    type: "boolean",
  },
  lnp: {
    defaultValue: "true",
    description: `Add the linesnetworkplans layer to the map. This layer will display lines network plans on the map.`,
    public: true,
    type: "boolean",
  },
  lnpid: {
    description: `An id or a short/long name of a line to highlight. <br/>Ex: S1`,
    public: true,
  },
  mapset: {
    defaultValue: "false",
    description: `Add the mapset layer to the map. This layer will display mapset plans on the map. By default, it will load only the standard plans valid at the current time.`,
    public: true,
    type: "boolean",
  },
  mapsetplanid: {
    description:
      "An id of the mapset plan to display. Mostly for debugging purposes.",
    public: true,
  },
  mapsettags: {
    description: `The ${geopsMapsetApiLink} tags to get the plans from.`,
    public: true,
  },
  mapsettenants: {
    defaultValue: "geopstest",
    description: `The ${geopsMapsetApiLink} tenant to get the plans from.`,
    public: true,
  },
  mapsettimestamp: {
    description: `The ${geopsMapsetApiLink} timestamp used to load valid standard plan. If not defined it will use the current time.`,
    public: true,
  },
  mapseturl: {
    defaultValue: "https://editor.mapset.io/api/v1/",
    description: `The ${geopsMapsetApiLink} url to use.`,
    public: true,
  },
  mapsurl: {
    defaultValue: "https://maps.geops.io",
    description: `The ${geopsMapsApiLink} url to use.`,
    public: true,
  },
  maxextent: {
    description:
      "The maximum extent of the map in EPSG:3857 coordinates.<br/>Ex: 831634,5933959,940649,6173660 .",
    public: true,
  },
  maxzoom: {
    description: "The maximal zoom level of the map.",
    public: true,
  },
  minzoom: {
    description: "The minimal zoom level of the map.",
    public: true,
  },
  mots: {
    description:
      "Commas separated list of mots to display on the Realtime layer.<br/>Ex: rail,bus,coach,foot,tram,subway,gondola,funicular,ferry,car .",
    public: true,
  },
  notification: {
    defaultValue: "false",
    description: `Add the notification layer to the map. This layer will display informations about disruptions on the network. Data comes from
        our ${geopsMocoApiLink} .`,
    public: true,
    type: "boolean",
  },
  notificationat: {
    description:
      "An ISO date string used to display active notification at this date in the notification layer. If not defined the current date will be used.<br/>Ex: 2025-08-01T00:00:00Z .",
    public: true,
  },
  notificationid: {
    description: `An id of a notification to show details of.`,
    public: true,
  },
  notificationtenant: {
    defaultValue: "geopstest",
    description: `The ${geopsMocoApiLink} tenant to get the notification from.`,
    public: true,
  },
  notificationurl: {
    defaultValue: "https://moco.geops.io/api/v2/",
    description: `The ${geopsMocoApiLink} url to use.`,
    public: true,
  },
  permalink: {
    defaultValue: "false",
    description:
      "if true, the current browser window url will be updated automatically with the parameters defined in the `permalinktemplate` attribute.",
    public: true,
    type: "boolean",
  },
  permalinktemplate: {
    defaultValue: "?x={{x}}&y={{y}}&z={{z}}&layers={{layers}}",
    description: `A template string to read the current browser url. Hash (starting with #) and URL search parameters (starting with ?) are supported.<br/>
     The template supports {{x}}, {{y}}, {{z}} and {{layers}} variables.<br/>
     Ex: "?x={{x}}&y={{y}}&z={{z}}" or "#map/{{x}}/{{y}}/{{z}}" .`,
    public: true,
  },
  print: {
    defaultValue: "true",
    description: "Show/hide the print button in the toolbar.",
    public: true,
    type: "boolean",
  },
  queryablelayers: {
    defaultValue: DEFAULT_QUERYABLE_LAYERS.toString(),
    description: `A comma separated list of layers's name. The data of these layers will be queryable by click on the map (see selectedfeature event). If empty, all layers will not be queryable.<br/>
        Layers available are ${Object.values(LAYERS_NAMES).join(", ")}`,
    public: true,
  },
  realtime: {
    defaultValue: "true",
    description: `Add the realtime layer to the map. Data comes from the ${geopsRealtimeApiLink} .`,
    public: true,
    type: "boolean",
  },
  realtimebboxparameters: {
    description:
      "A space separated list of parameters to add to the realtime BBOX request to define custom behavior.<br/>Ex: graph=XXX line_tags=XXX.",
    public: true,
  },
  realtimetenant: {
    description: `The ${geopsRealtimeApiLink} tenant to get the realtime data from.`,
    public: true,
  },
  realtimeurl: {
    defaultValue: "wss://api.geops.io/tracker-ws/v1/ws",
    description: `The ${geopsRealtimeApiLink} url to use.`,
    public: true,
  },
  search: {
    defaultValue: "true",
    description: "Toggle the search stops input.",
    public: true,
    type: "boolean",
  },
  share: {
    defaultValue: "true",
    description: "Show/hide the share button in the toolbar.",
    public: true,
    type: "boolean",
  },
  stationid: {
    description: `An id or a short/long name of a station to show details of.`,
    public: true,
  },
  stopsurl: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: `The ${geopsStopsApiLink} to use.`,
    public: true,
  },
  tenant: {
    description: `The tenant to use by default for all geOps APIs (Stops, Realtime, MOCO ...). Can be override for each API by other XXXXtenant parameters.`,
    public: true,
  },
  toolbar: {
    defaultValue: "true",
    description: "Show/hide the toolbar on the top left.",
    public: true,
    type: "boolean",
  },
  trainid: {
    description: `An id of a route to highlight on the map and to show details of.`,
    public: true,
  },
  zoom: {
    defaultValue: "13",
    description: "The zoom level of the map.",
    public: true,
  },
};

export default attrs;
