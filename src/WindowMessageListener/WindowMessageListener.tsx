import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type MobilityEvent from "../utils/MobilityEvent";

function WindowMessageListener({ eventNode }: { eventNode: HTMLElement }) {
  const { setPreviewNotifications } = useMapContext();

  // Listen to parent window message events
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data.notification) {
        setPreviewNotifications([event.data.notification]);
      } else if (event.data.notifications) {
        setPreviewNotifications(event.data.notifications);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [setPreviewNotifications]);

  // Propagate wc events to the parent window
  useEffect(() => {
    if (!eventNode) {
      return;
    }

    const postMessage = (evt: MobilityEvent<unknown>) => {
      window.parent?.postMessage({ data: evt.data, type: evt.type }, "*");
    };
    eventNode.addEventListener("mwc:permalink", postMessage);
    eventNode.addEventListener("mwc:selectedfeature", postMessage);

    // warn the parent that the web component is listening
    window.parent?.postMessage({ data: true, type: "mwc:messageready" }, "*");

    return () => {
      eventNode.removeEventListener("mwc:permalink", postMessage);
      eventNode.removeEventListener("mwc:selectedfeature", postMessage);
    };
  }, [eventNode]);

  return null;
}
export default memo(WindowMessageListener);
