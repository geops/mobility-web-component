import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type MobilityEvent from "../utils/MobilityEvent";

const evtTypes = [
  "mwc:permalink",
  "mwc:selectedfeature",
  "mwc:singleclick",
  "mwc:attribute",
];

/**
 * This component propagate the web-components events to the parent window using messages events,
 * and listen for messages from the parent window.
 * @param param0
 * @returns
 */
function WindowMessageListener({ eventNode }: { eventNode: HTMLElement }) {
  const { setPreviewNotifications } = useMapContext();

  // Listen to parent window message events
  useEffect(() => {
    const onMessage = (event) => {
      if (event.data.situations) {
        setPreviewNotifications(event.data.situations);
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
      // Clean data before sending it to the parent
      if (evt.type === "mwc:attribute") {
        delete evt.data.children;
      }
      window.parent?.postMessage({ data: evt.data, type: evt.type }, "*");
    };
    evtTypes.forEach((eventType) => {
      eventNode.addEventListener(eventType, postMessage);
    });

    // warn the parent that the web component is listening
    window.parent?.postMessage({ data: true, type: "mwc:messageready" }, "*");

    return () => {
      evtTypes.forEach((eventType) => {
        eventNode.removeEventListener(eventType, postMessage);
      });
    };
  }, [eventNode]);

  return null;
}
export default memo(WindowMessageListener);
