import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";
import useZoom from "../utils/hooks/useZoom";
import {
  addNotificationsLayers,
  parsePreviewNotification,
  getNotificationsWithStatus,
} from "./notificationUtils";

type Graphs = Record<string, string>;

interface Metadata {
  graphs?: Graphs;
}

const useNotifications = () => {
  const {
    baselayer,
    notificationurl,
    notificationbeforelayerid,
    notificationat,
    baseLayer,
  } = useMapContext();
  const zoom = useZoom();
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] =
    useState<boolean>(true);

  const [style, setStyle] = useState<string>();
  const [styleMetadata, setStyleMetadata] = useState<Metadata>();

  useEffect(() => {
    if (!baseLayer) {
      return;
    }
    setStyle(baselayer);
    if (!baseLayer.loaded) {
      // @ts-expect-error bad type definition
      baseLayer.once("load", () =>
        setStyleMetadata(baseLayer.mbMap?.getStyle()?.metadata),
      );
    } else {
      setStyleMetadata(baseLayer.mbMap?.getStyle()?.metadata);
    }
  }, [baseLayer, baselayer]);

  const now = useMemo(() => {
    return notificationat ? new Date(notificationat) : new Date();
  }, [notificationat]);

  const graphMapping = useMemo(() => {
    return styleMetadata?.graphs || { 1: "osm" };
  }, [styleMetadata]);

  const graphsString = useMemo(() => {
    return [
      ...new Set(
        Object.keys(graphMapping || []).map((key) => graphMapping[key]),
      ),
    ].join(",");
  }, [graphMapping]);

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
    let abortCtrl: AbortController;

    // Fetch the main MOCO notifications
    const fetchNotifications = async () => {
      const suffix = /\?/.test(notificationurl) ? "&" : "?";
      const url = `${notificationurl}${suffix}graph=${graphsString}`;

      abortCtrl?.abort();
      abortCtrl = new AbortController();
      const response = await fetch(url, { signal: abortCtrl.signal });
      const data = await response.json();
      setNotifications(getNotificationsWithStatus(data, now));
      setShouldAddPreviewNotifications(true);
    };

    if (notificationurl && graphsString) {
      fetchNotifications();
    }

    return () => {
      abortCtrl?.abort();
    };
  }, [notificationurl, graphsString, now]);

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
    now,
  ]);

  useEffect(() => {
    // Add the notifications to the map
    if (styleMetadata && notifications?.length) {
      addNotificationsLayers(
        baseLayer,
        notifications,
        notificationbeforelayerid,
        zoom,
        graphMapping,
      );
    }
  }, [
    notifications,
    notificationbeforelayerid,
    styleMetadata,
    zoom,
    graphMapping,
    baseLayer,
  ]);

  return notifications;
};

export default function NotificationLayer() {
  useNotifications();
  return null;
}
