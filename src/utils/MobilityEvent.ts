import MobilityEventData from "../MobilityMap/MobilityMapProps";

export type MobilityEventType = "mwc:attribute";

class MobilityEvent extends Event {
  data: MobilityEventData;

  constructor(
    name: MobilityEventType,
    data: MobilityEventData,
    options: EventInit = {},
  ) {
    super(name, { ...options, composed: true });
    this.data = { ...data };
  }

  logImportantData() {
    // eslint-disable-next-line no-console
    console.log(this.data);
  }
}

export default MobilityEvent;
