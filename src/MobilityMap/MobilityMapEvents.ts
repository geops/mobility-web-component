export interface WebComponentEventDoc {
  description: string;
  public?: boolean;
}

export type MobilityMapEventName =
  | "mwc:attribute"
  | "mwc:messageready"
  | "mwc:permalink"
  | "mwc:selectedfeature"
  | "mwc:singleclick"
  | "mwc:stopssearchselect";

export type MobilityMapEvents = Record<
  MobilityMapEventName,
  WebComponentEventDoc
>;

const attrs: MobilityMapEvents = {
  "mwc:attribute": {
    description:
      "Event fired when an web component's attribute is changed. The event data contains the list of all attributes and their values.",
    public: true,
  },
  "mwc:messageready": {
    description:
      "Only if the web-component is embedded in an iframe. Message event fired when the web component is ready to receive messages from parent window.",

    public: true,
  },
  "mwc:permalink": {
    description:
      "Event fired when the map's state changes. The event data contains the permalink URL search parameters as string.",
    public: true,
  },
  "mwc:selectedfeature": {
    description:
      "Event fired when a feature is selected on the map. The event data contains the selected feature in GeoJSON format.",
    public: true,
  },
  "mwc:singleclick": {
    description:
      "Event fired when the map is clicked. The event data contains the map coordinates in EPSG:3857 and the pixel coordinates.",
    public: true,
  },
  "mwc:stopssearchselect": {
    description:
      "Only when search attribute is 'true'. Event fired when a stop is selected in the stops search results. The event data contains the selected stop.",
    public: true,
  },
};

export default attrs;
