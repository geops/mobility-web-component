import { MocoLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_NOTIFICATION } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MocoLayerOptions } from "mobility-toolbox-js/ol";

function NotificationLayer(props?: Partial<MocoLayerOptions>) {
  const {
    apikey,
    baseLayer,
    map,
    notificationat,
    notificationtenant,
    notificationurl,
    previewNotifications,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    return new MocoLayer({
      apiKey: apikey,
      date: notificationat ? new Date(notificationat) : undefined,
      maplibreLayer: baseLayer,
      name: LAYER_NAME_NOTIFICATION,
      situations: previewNotifications,
      tenant: notificationtenant,
      url: notificationurl,
      ...(props || {}),
    });
  }, [
    apikey,
    baseLayer,
    notificationat,
    notificationtenant,
    notificationurl,
    previewNotifications,
    props,
  ]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return null;
}

export default memo(NotificationLayer);
