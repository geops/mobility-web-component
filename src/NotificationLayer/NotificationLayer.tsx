import { useContext, useEffect, useState } from "preact/hooks";
import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { MapContext } from "../MobilityToolboxMap";
import addNotificationsLayers from "./addNotificationsLayers";
import getNotificationsWithStatus from "./getNotificationsWithStatus";

type Props = {
  mode: string;
};

const params = new URLSearchParams(window.location.search);

const useNotifications = (map: Map, mode: string, baseLayer: MaplibreLayer) => {
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] = useState(false);
  const now = params.get("notificationat")
    ? new Date(params.get("notificationat"))
    : new Date();

  useEffect(() => {
    // Listen for imcoming messages through the MOCO iframe
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
      const response = await fetch(
        "https://moco.dev.geops.io/api/v1/export/notification/?graph=np_5&public_at=2023-08-30T09:49:51.322Z&sso_config=sob",
      );
      const data = await response.json();
      setNotifications(getNotificationsWithStatus(data, now));
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    // Merge notifications with the previewNotification
    const newNotifications = [...notifications]
    if (shouldAddPreviewNotifications && previewNotification?.[mode]) {
      const index = newNotifications.findIndex(
        (n) =>
          n.properties.id ===
          previewNotification[mode].properties.id,
      );
      if (index > -1) {
        newNotifications[index] = previewNotification[mode];
      } else {
        newNotifications.push(previewNotification[mode]);
      }
      setNotifications(getNotificationsWithStatus(newNotifications, now));
    }
  }, [previewNotification, mode, shouldAddPreviewNotifications])
  
  useEffect(() => {
    // Add the notifications to the map
    if (notifications?.length) {
      addNotificationsLayers(
        baseLayer,
        notifications,
        'netzplan_line',
      );      
    } 
  }, [notifications])

  
  
  return { notifications };
}

export default function NotificationLayer({ mode }: Props) {
  const { map, baseLayer } = useContext(MapContext);
  useNotifications(map, mode, baseLayer);
  return null;
}