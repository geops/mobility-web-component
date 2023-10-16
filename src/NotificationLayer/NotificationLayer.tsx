import { useEffect, useState } from "preact/hooks";
import {
  addNotificationsLayers,
  parsePreviewNotification,
  getNotificationsWithStatus,
} from "./notificationUtils";
import { unByKey } from "ol/Observable";

import useMapContext from "../utils/hooks/useMapContext";
import useParams from "../utils/hooks/useParams";

interface Graphs {
  [key: string]: string;
}

interface Metadata {
  graphs?: Graphs;
}

let zoomTimeout = null;
let abortCtrl = new AbortController();

const useZoom = () => {
  const { map } = useMapContext();
  const [zoom, setZoom] = useState(map.getView().getZoom());
  useEffect(() => {
    const view = map.getView();
    const zoomListener = view.on("change:resolution", () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => setZoom(view.getZoom()), 150);
    });
    return () => unByKey(zoomListener);
  }),
    [map];
  return zoom;
};

const useNotifications = (
  notificationUrl: string | undefined,
  notificationBeforeLayerId: string,
) => {
  const {
    notificationurl: paramsNotificationUrl,
    notificationbeforelayerid: paramsNotificationBeforeLayerId,
    notificationat: paramsNotificationAt,
  } = useParams();
  const { baseLayer } = useMapContext();
  const zoom = useZoom();
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] =
    useState<boolean>(true);
  const [styleMetadata, setStyleMetadata] = useState<Metadata>(
    baseLayer.mbMap?.getStyle()?.metadata,
  );
  if (!styleMetadata || !baseLayer.loaded) {
    // @ts-ignore
    baseLayer.once("load", () =>
      setStyleMetadata(baseLayer.mbMap?.getStyle()?.metadata),
    );
  }
  const notificationsUrl = paramsNotificationUrl || notificationUrl;
  const beforeLayerId =
    paramsNotificationBeforeLayerId || notificationBeforeLayerId;
  const now = paramsNotificationAt
    ? new Date(paramsNotificationAt)
    : new Date();
  const style = baseLayer.name.split("mwc.baselayer.")[1];
  const graphMapping = styleMetadata?.graphs || { 1: "osm" };
  const graphsString = [
    ...new Set(Object.keys(graphMapping || []).map((key) => graphMapping[key])),
  ].join(",");

  useEffect(() => {
    // Listen for incoming messages through the MOCO iframe
    window.addEventListener("message", (event) => {
      if (event.data.notification) {
        setPreviewNotification(event.data.notification);
        setShouldAddPreviewNotifications(true);
      }
    });
  }, []);

  useEffect(() => {
    // Fetch the main MOCO notifications
    const fetchNotifications = async () => {
      const suffix = /\?/.test(notificationsUrl) ? "&" : "?";
      const url = `${notificationsUrl}${suffix}graph=${graphsString}`;

      abortCtrl.abort();
      abortCtrl = new AbortController();
      const response = await fetch(url, { signal: abortCtrl.signal });
      const data = await response.json();
      setNotifications(getNotificationsWithStatus(data, now));
      setShouldAddPreviewNotifications(true);
    };

    if (notificationsUrl && graphsString) {
      fetchNotifications();
    }
  }, [notificationsUrl, graphsString]);

  useEffect(() => {
    // Merge notifications with the previewNotification
    const newNotifications = [...notifications];
    if (shouldAddPreviewNotifications && previewNotification?.[style]) {
      const parsedPreviewNotification = parsePreviewNotification(
        previewNotification?.[style],
      );
      const index = newNotifications.findIndex(
        (n) => n.properties.id === previewNotification[style].id,
      );

      if (index > -1) {
        newNotifications[index] = parsedPreviewNotification;
      } else {
        newNotifications.push(parsedPreviewNotification);
      }

      setNotifications(getNotificationsWithStatus(newNotifications, now));
      setShouldAddPreviewNotifications(false);
    }
  }, [
    previewNotification,
    notifications,
    shouldAddPreviewNotifications,
    style,
  ]);

  useEffect(() => {
    // Add the notifications to the map
    if (styleMetadata && notifications?.length) {
      addNotificationsLayers(
        baseLayer,
        notifications,
        beforeLayerId,
        zoom,
        graphMapping,
      );
    }
  }, [notifications, styleMetadata, zoom]);

  return notifications;
};

type Props = {
  notificationUrl: string;
  notificationBeforeLayerId: string;
};

export default function NotificationLayer({
  notificationUrl,
  notificationBeforeLayerId,
}: Props) {
  useNotifications(notificationUrl, notificationBeforeLayerId);
  return null;
}
