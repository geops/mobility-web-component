import { MocoLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import { LAYER_NAME_NOTIFICATIONS } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MocoLayerOptions } from "mobility-toolbox-js/ol";

function NotificationsLayer(props?: Partial<MocoLayerOptions>) {
  const {
    apikey,
    baseLayer,
    map,
    notificationat,
    notificationtenant,
    notificationurl,
    previewNotifications,
    setNotificationsLayer,
  } = useMapContext();

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    const mocoLayer = new MocoLayer({
      apiKey: apikey,
      apiParameters: {
        contentMedium: true,
      },
      date: notificationat ? new Date(notificationat) : undefined,
      maplibreLayer: baseLayer,
      name: LAYER_NAME_NOTIFICATIONS,
      situations: previewNotifications,
      tenant: notificationtenant,
      url: notificationurl,
      ...(props || {}),
      loadAll: !previewNotifications,
    });
    if (!!previewNotifications && !mocoLayer.getVisible()) {
      mocoLayer.setVisible(true);
    }
    return mocoLayer;
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
    setNotificationsLayer?.(layer);
  }, [layer, setNotificationsLayer]);

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

export default memo(NotificationsLayer);
