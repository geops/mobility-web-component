import { useEffect, useState } from 'preact/hooks';
import addNotificationsLayers from './addNotificationsLayers';
import getNotificationsWithStatus from './getNotificationsWithStatus';
import parsePreviewNotification from './parsePreviewNotification';
import { unByKey } from 'ol/Observable';

import useMapContext from '../lib/hooks/useMapContext';

interface Graphs {
  [key: string]: string;
}

interface Metadata {
  graphs?: Graphs;
}

const params = new URLSearchParams(window.location.search);
let zoomTimeout = null;
let abortCtrl = new AbortController();

const useZoom = () => {
  const [zoom, setZoom] = useState(10);
  const { map } = useMapContext();
  useEffect(() => {
    const view = map.getView();
    const zoomListener = view.on('change:resolution', () => {
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
  const { baseLayer } = useMapContext();
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] =
    useState(true);
  const zoom = useZoom();
  const [styleMetadata, setStyleMetadata] = useState<Metadata>(
    baseLayer.mbMap?.getStyle()?.metadata,
  );
  if (!styleMetadata || !baseLayer.loaded) {
    // @ts-ignore
    baseLayer.once('load', () =>
      setStyleMetadata(baseLayer.mbMap?.getStyle()?.metadata),
    );
  }

  const notificationsUrl = params.get('notificationurl') || notificationUrl;
  const beforeLayerId =
    params.get('notificationbeforelayerid') || notificationBeforeLayerId;
  const now = params.get('notificationat')
    ? new Date(params.get('notificationat'))
    : new Date();
  const style = baseLayer.name.split('mwc.baselayer.')[1];
  const graphMapping = styleMetadata?.graphs || { 1: 'osm' };
  const graphsString = [
    ...new Set(Object.keys(graphMapping || []).map((key) => graphMapping[key])),
  ].join(',');

  useEffect(() => {
    // Listen for incoming messages through the MOCO iframe
    window.addEventListener('message', (event) => {
      if (event.data.notification) {
        setPreviewNotification(event.data.notification);
        setShouldAddPreviewNotifications(true);
      }
    });
  }, []);

  useEffect(() => {
    // Fetch the main MOCO notifications
    const fetchNotifications = async () => {
      const suffix = /\?/.test(notificationsUrl) ? '&' : '?';
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
