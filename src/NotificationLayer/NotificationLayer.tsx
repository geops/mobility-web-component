import { useContext, useEffect, useState, useMemo } from "preact/hooks";
import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MapContext } from "../MobilityToolboxMap";
import addNotificationsLayers from "./addNotificationsLayers";
import getNotificationsWithStatus from "./getNotificationsWithStatus";

const params = new URLSearchParams(window.location.search);

const useNotifications = (baseLayer: MaplibreLayer) => {
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] = useState(false);
  const notificationsUrl = useMemo(() => params.get("notificationurl"), []);
  const mode = useMemo(() => params.get("mode") || "topographic", []);
  const now = useMemo(() => {
    return params.get("notificationat")
      ? new Date(params.get("notificationat"))
      : new Date()
  }, []);    

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
      const response = await fetch(notificationsUrl);
      const data = await response.json();
      setNotifications(getNotificationsWithStatus(data, now));
    }
    
    if (notificationsUrl) {
      fetchNotifications()
    }
  }, [notificationsUrl, mode, now]);

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
  }, [previewNotification, mode, shouldAddPreviewNotifications]);
  
  useEffect(() => {
    // Add the notifications to the map
    if (notifications?.length) {
      addNotificationsLayers(
        baseLayer,
        notifications,
        'netzplan_line',
      );      
    } 
  }, [notifications]);
  
  return { notifications };
}

export default function NotificationLayer() {
  const { baseLayer } = useContext(MapContext);
  useNotifications(baseLayer);
  return null;
}