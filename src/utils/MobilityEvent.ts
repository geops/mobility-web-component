import type { MobilityMapProps } from "../MobilityMap/MobilityMap";

export type MobilityEventType = "mwc:attribute";
export type AttributeEventData = MobilityMapProps;
export type MobilityEventData = AttributeEventData;

class MobilityEvent extends Event {
  data: MobilityMapProps;

  constructor(
    name: MobilityEventType,
    data: MobilityMapProps,
    options: EventInit = {},
  ) {
    super(name, { ...options, composed: true });
    this.data = { ...data };
  }

  logImportantData() {
    console.log(this.data);
  }
}

export default MobilityEvent;
