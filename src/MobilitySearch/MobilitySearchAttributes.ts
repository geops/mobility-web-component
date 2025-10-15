import type { WebComponentAttributeDoc } from "../MobilityMap/MobilityMapAttributes";

const geopsApiLink = `<a href="https://developer.geops.io/">geOps API key</a>`;
const geopsStopsApiLink = `<a href="https://developer.geops.io/apis/stops">geOps Stops API</a>`;

export type MobilitySearchAttributeName =
  | "apikey"
  | "bbox"
  | "countrycode"
  | "event"
  | "field"
  | "limit"
  | "mots"
  | "onselect"
  | "params"
  | "prefagencies"
  | "reflocation"
  | "url";

export type MobilitySearchAttributes = Record<
  MobilitySearchAttributeName,
  WebComponentAttributeDoc
>;

const attrs: MobilitySearchAttributes = {
  apikey: {
    description: `Your ${geopsApiLink}`,
    public: true,
  },
  bbox: {
    description: `The extent where to search the stops (minx,miny,maxx,maxy). See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  countrycode: {
    description: "The country code to filter the results (IT, DE, CH ...)",
    public: true,
  },
  event: {
    defaultValue: "mwc:stopssearchselect",
    description: "The event's name to listen to when a stop is selected.",
    public: true,
  },
  field: {
    description: `Which field to look up, default all of them, Possible values:id, name, coords. See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  limit: {
    defaultValue: "5",
    description: `The number of suggestions to show. See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  mots: {
    description: `Commas separated list of mots used to filter the results (rail, bus, coach, foot, tram, subway, gondola, funicular, ferry, car). See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  onselect: {
    description: null, //`Function called when a stop is selected. The function receives the selected stop as parameter.`,
    public: false,
  },
  params: {
    description: `JSON string with additional parameters to pass to the request to the API. Ex: {"{ 'key': 'value' }"}. See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  prefagencies: {
    description: `comma seperated list, order chooses which agency will be preferred as
        ident_source (for id and code fields). Possible values: sbb, db. See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  reflocation: {
    description: `Coordinates in WGS84 (in lat,lon order) used to rank stops close to this position higher. See the ${geopsStopsApiLink} documentation.`,
    public: true,
  },
  url: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: `The URL to the ${geopsStopsApiLink}.`,
    public: true,
  },
};

export default attrs;
