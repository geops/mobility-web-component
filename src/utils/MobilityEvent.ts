export type MobilityEventType =
  | "mwc:attribute"
  | "mwc:stopssearchselect"
  | string;

class MobilityEvent<T> extends Event {
  data: T;

  constructor(name: MobilityEventType, data: T, options: EventInit = {}) {
    super(name, { ...options, composed: true });
    this.data = data;
  }

  logImportantData() {
    // eslint-disable-next-line no-console
    console.log(this.data);
  }
}

export default MobilityEvent;
