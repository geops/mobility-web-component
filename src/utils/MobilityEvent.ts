import type { MobilityMapProps } from "../MobilityMap/MobilityMap";

export type MobilityEventType =
  | "mwc:attribute"
  | "mwc:stopssearchselect"
  | string;

class MobilityEvent<T> extends Event {
  data: MobilityMapProps;

  constructor(name: MobilityEventType, data: T, options: EventInit = {}) {
    super(name, { ...options, composed: true });
    this.data = data;
  }

  logImportantData() {
    console.log(this.data);
  }
}

export default MobilityEvent;
