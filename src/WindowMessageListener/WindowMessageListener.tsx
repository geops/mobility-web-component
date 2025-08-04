import { memo } from "preact/compat";
import { useCallback, useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

function WindowMessageListener() {
  const { setPreviewNotification } = useMapContext();

  const onMessage = useCallback(
    (event) => {
      console.log("Received message from parent:", event.data);
      if (event.data.notification) {
        setPreviewNotification([event.data.notification]);
      }
    },
    [setPreviewNotification],
  );

  useEffect(() => {
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [onMessage]);

  return null;
}
export default memo(WindowMessageListener);
