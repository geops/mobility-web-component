import { useContext, useEffect, useState, useMemo } from "preact/hooks";
import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MapContext } from "../MobilityToolboxMap";
import addNotificationsLayers from "./addNotificationsLayers";
import getNotificationsWithStatus from "./getNotificationsWithStatus";
import testNotification from "../../testNotification.js";

const params = new URLSearchParams(window.location.search);

const useNotifications = (baseLayer: MaplibreLayer) => {
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(testNotification);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] = useState(true);
  const notificationsUrl = useMemo(() => params.get("notificationurl"), []);
  const mode = useMemo(() => params.get("mode") || "topographic", []);
  const now = useMemo(() => {
    return params.get("notificationat")
      ? new Date(params.get("notificationat"))
      : new Date()
  }, []);    

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
      const response = await fetch(notificationsUrl);
      const data = await response.json();
      setNotifications(getNotificationsWithStatus(data, now));
    }
    
    if (notificationsUrl) {
      fetchNotifications();
    }
  }, [notificationsUrl, mode, now]);

  useEffect(() => {
    console.log(previewNotification);
    
    // Merge notifications with the previewNotification
    const newNotifications = [...notifications];
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
      setShouldAddPreviewNotifications(false);
    }
  }, [previewNotification, mode, notifications, shouldAddPreviewNotifications]);
  
  useEffect(() => {
    console.log(notifications);
    
    // Add the notifications to the map
    if (notifications?.length) {
      // TODO: Make the beforeLayerId configurable
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
  const { map, baseLayer } = useContext(MapContext);
  useNotifications(baseLayer, map);
  return null;
}