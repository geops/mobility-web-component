import { useContext, useEffect, useState, useMemo } from "preact/hooks";
import { Map } from "ol";
import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { MapContext } from "../MobilityToolboxMap";
import addNotificationsLayers from "./addNotificationsLayers";
import getNotificationsWithStatus from "./getNotificationsWithStatus";
import parsePreviewNotification from "./parsePreviewNotification";
import { unByKey } from "ol/Observable";

const params = new URLSearchParams(window.location.search);
let zoomTimeout = null;
let abortCtrl = new AbortController();

const useNotifications = (
  baseLayer: MaplibreLayer,
  map: Map,
  notificationUrl: string | undefined,
  graphs: string | undefined
) => {
  const [notifications, setNotifications] = useState([]);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [shouldAddPreviewNotifications, setShouldAddPreviewNotifications] = useState(true);
  const [zoom, setZoom] = useState(10);
  const notificationGraphs = useMemo(() => {
    const graphParam = params.get("notificationgraphs") ;
    return (graphParam || graphs) ? (graphParam || graphs).split(",") : ["osm"];
  }, []);
  const notificationsUrl = useMemo(
    () => params.get("notificationurl") || notificationUrl, [notificationUrl]
  );
  const mode = useMemo(() => params.get("mode") || "topographic", []);
  const now = useMemo(() => {
    return params.get("notificationat")
      ? new Date(params.get("notificationat"))
      : new Date()
  }, []);

  useEffect(() => {
    const view = map.getView();
    const zoomListener = view.on("change:resolution", () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => setZoom(view.getZoom()), 150);
    });
    return () => unByKey(zoomListener);
  }), [map];  

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
      const url = `${notificationsUrl}${suffix}graph=${notificationGraphs.join(',')}`;

      abortCtrl.abort();
      abortCtrl = new AbortController();
      const response = await fetch(url, { signal: abortCtrl.signal});
      const data = await response.json();

      setNotifications(getNotificationsWithStatus(data, now));
    }

    if (notificationsUrl && now && notificationGraphs.length) {
      fetchNotifications();
    }
  }, [notificationsUrl, mode, now, notificationGraphs]);

  useEffect(() => {    
    // Merge notifications with the previewNotification
    const newNotifications = [...notifications];
    if (shouldAddPreviewNotifications && previewNotification?.[mode]) {
      const parsedPreviewNotification = parsePreviewNotification(previewNotification?.[mode])
      const index = newNotifications.findIndex(
        (n) =>
        n.properties.id ===
        previewNotification[mode].id,
        );
        if (index > -1) {
          newNotifications[index] = parsedPreviewNotification;
        } else {
          newNotifications.push(parsedPreviewNotification);
        }
        console.log('previewNotification: ', newNotifications);
        setNotifications(getNotificationsWithStatus(newNotifications, now));
        setShouldAddPreviewNotifications(false);
      }
  }, [previewNotification, mode, notifications, shouldAddPreviewNotifications]);
  
  useEffect(() => {
    // Add the notifications to the map
    if (notifications?.length) {
      // TODO: Make the beforeLayerId configurable
      addNotificationsLayers(
        baseLayer,
        notifications,
        'netzplan_line_lable',
        zoom,
        mode,
      );      
    } 
  }, [notifications, zoom]);

  console.log(previewNotification);
  
  
  return { notifications };
}

type Props = {
  notificationUrl: string;
  notificationGraphs: string;
}

export default function NotificationLayer({ notificationUrl, notificationGraphs }: Props) {
  const { map, baseLayer } = useContext(MapContext);
  useNotifications(baseLayer, map, notificationUrl, notificationGraphs);
  useEffect(() => {
    // zoom > 12 makes no sense with network plans
    // TODO: make this configurable
    map.getView().setMaxZoom(12)
  }, [])
  return null;
}