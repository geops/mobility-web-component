import { MocoLayer } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";

import { LAYER_NAME_NOTIFICATIONS, MAX_EXTENT } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { MocoLayerOptions } from "mobility-toolbox-js/ol";

function NotificationsLayer(props?: Partial<MocoLayerOptions>) {
  const {
    apikey,
    baseLayer,
    linesNetworkPlanLayer,
    map,
    notificationat,
    notificationtenant,
    notificationurl,
    previewNotifications,
    setNotificationsLayer,
  } = useMapContext();
  const [isLnpVisible, setIsLnpVisible] = useState(
    !!linesNetworkPlanLayer?.getVisible(),
  );

  const layer = useMemo(() => {
    if (!baseLayer) {
      return null;
    }
    const mocoLayer = new MocoLayer({
      apiKey: apikey,
      apiParameters: {
        bbox: MAX_EXTENT,
        contentMedium: true,
      },
      maplibreLayer: baseLayer,
      name: LAYER_NAME_NOTIFICATIONS,
      publicAt: notificationat ? new Date(notificationat) : undefined,
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
    baseLayer,
    apikey,
    notificationat,
    previewNotifications,
    notificationtenant,
    notificationurl,
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

  // Watch lnp visibility
  useEffect(() => {
    const key = linesNetworkPlanLayer?.on("change:visible", () => {
      const visible = linesNetworkPlanLayer.getVisible();
      setIsLnpVisible(visible);
    });
    setIsLnpVisible(linesNetworkPlanLayer?.getVisible() || false);
    return () => {
      unByKey(key);
    };
  }, [linesNetworkPlanLayer]);

  // Change the layersFilter based on lnp visibility
  // Moco layers must de hidden by default otherwise, on load, everything is displayed
  useEffect(() => {
    if (!layer) {
      return;
    }
    const visible = layer.getVisible();
    if (visible) {
      layer.setVisible(false);
    }

    if (isLnpVisible) {
      layer.layersFilter = (layerSpec) => {
        return layerSpec.metadata?.["general.filter"] === "moco.lnp";
      };
    } else {
      layer.layersFilter = (layerSpec) => {
        return layerSpec.metadata?.["general.filter"] === "moco";
      };
    }

    layer.setVisible(visible);
    return () => {
      layer.applyLayoutVisibility();
    };
  }, [isLnpVisible, layer, linesNetworkPlanLayer]);

  return null;
}

export default memo(NotificationsLayer);
