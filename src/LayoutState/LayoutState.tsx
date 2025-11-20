import { useCallback, useEffect } from "preact/hooks";

import useFit from "../utils/hooks/useFit";
import useLnpLineInfo, { useLnpStopInfo } from "../utils/hooks/useLnp";
import useMapContext from "../utils/hooks/useMapContext";
import useRealtimeTrainByRouteIdentifier from "../utils/hooks/useRealtimeTrainsByRouteIdentifier";

/**
 * This component is responsible for updating the layout state in the context.
 */
function LayoutState() {
  const {
    details,
    embed,
    geolocation,
    hasDetails,
    hasLayerTree,
    hasLnp,
    hasNotification,
    hasPrint,
    hasRealtime,
    hasShare,
    isExportMenuOpen,
    isLayerTreeOpen,
    isSearchOpen,
    isShareMenuOpen,
    layertree,
    lineid,
    linesIds,
    lnp,
    mapset,
    notification,
    notificationid,
    notificationId,
    permalink,
    previewNotifications,
    print,
    realtime,
    search,
    selectedFeature,
    setFeaturesInfos,
    setHasDetails,
    setHasGeolocation,
    setHasLayerTree,
    setHasLnp,
    setHasMapset,
    setHasNotification,
    setHasPermalink,
    setHasPrint,
    setHasRealtime,
    setHasSearch,
    setHasShare,
    setHasStations,
    setHasToolbar,
    setIsEmbed,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsOverlayOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
    share,
    stationId,
    stationid,
    tenant,
    toolbar,
    trainid,
    trainId,
  } = useMapContext();

  const lineInfo = useLnpLineInfo(lineid);
  const stopInfo = useLnpStopInfo(stationid);
  const trainInfo = useRealtimeTrainByRouteIdentifier(trainid);
  const fit = useFit();

  useEffect(() => {
    setHasStations(!!tenant);
  }, [setHasStations, tenant]);

  useEffect(() => {
    setHasRealtime(realtime === "true");
  }, [realtime, setHasRealtime]);

  useEffect(() => {
    setHasNotification(notification === "true" || !!previewNotifications);
  }, [notification, previewNotifications, setHasNotification]);

  useEffect(() => {
    setHasMapset(mapset === "true");
  }, [mapset, setHasMapset]);

  useEffect(() => {
    setHasGeolocation(geolocation === "true");
  }, [geolocation, setHasGeolocation]);

  useEffect(() => {
    setHasPermalink(permalink === "true");
  }, [permalink, setHasPermalink]);

  useEffect(() => {
    setHasSearch(search === "true");
  }, [search, setHasSearch]);

  useEffect(() => {
    setIsEmbed(embed === "true");
  }, [embed, setIsEmbed]);

  useEffect(() => {
    setHasLnp(lnp === "true");
  }, [lnp, setHasLnp]);

  useEffect(() => {
    setHasShare(share === "true");
  }, [share, setHasShare]);

  useEffect(() => {
    setHasPrint(print === "true");
  }, [print, setHasPrint]);

  useEffect(() => {
    setHasDetails(details === "true");
  }, [details, setHasDetails]);

  useEffect(() => {
    setHasToolbar(toolbar === "true");
  }, [toolbar, setHasToolbar]);

  useEffect(() => {
    setHasLayerTree(layertree === "true");
  }, [layertree, setHasLayerTree]);

  useEffect(() => {
    setLinesIds(lineInfo?.external_id ? [lineInfo.external_id] : null);
  }, [lineInfo, setLinesIds]);

  // Zoom when linesids attribute changes
  useEffect(() => {
    fit.current(lineInfo, true);
  }, [lineInfo, fit]);

  useEffect(() => {
    setStationId(stopInfo?.external_id);
  }, [stopInfo, setStationId]);

  // Center and zoom when stationid attribute changes
  useEffect(() => {
    fit.current(stopInfo, true);
  }, [stopInfo, fit]);

  useEffect(() => {
    setNotificationId(notificationid);
  }, [notificationid, setNotificationId]);

  useEffect(() => {
    setTrainId(trainInfo?.train_id);
  }, [setTrainId, trainInfo]);

  // Center and zoom when trainid attribute changes
  useEffect(() => {
    fit.current(trainInfo, true);
  }, [trainInfo, fit]);

  // Close all menus
  const closeMenus = useCallback(() => {
    setIsLayerTreeOpen(false);
    setIsExportMenuOpen(false);
    setIsSearchOpen(false);
    setIsShareMenuOpen(false);
  }, [
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
  ]);

  // Close all features details
  const closeFeatureDetails = useCallback(() => {
    setStationId(null);
    setTrainId(null);
    setNotificationId(null);
    setLinesIds(null);
    setFeaturesInfos(null);
  }, [
    setStationId,
    setTrainId,
    setNotificationId,
    setLinesIds,
    setFeaturesInfos,
  ]);

  useEffect(() => {
    if (isSearchOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsShareMenuOpen(false);
      setStationId(null);

      closeFeatureDetails();
    }
  }, [
    closeFeatureDetails,
    isSearchOpen,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsShareMenuOpen,
    setStationId,
  ]);

  useEffect(() => {
    if (isShareMenuOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);

      closeFeatureDetails();
    }
  }, [
    isShareMenuOpen,
    closeFeatureDetails,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
  ]);

  useEffect(() => {
    if (isLayerTreeOpen) {
      setIsExportMenuOpen(false);
      setIsLayerTreeOpen(isLayerTreeOpen);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      closeFeatureDetails();
    }
  }, [
    isLayerTreeOpen,
    closeFeatureDetails,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
  ]);

  useEffect(() => {
    if (isExportMenuOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(isExportMenuOpen);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      closeFeatureDetails();
    }
  }, [
    closeFeatureDetails,
    isExportMenuOpen,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
  ]);

  useEffect(() => {
    if (selectedFeature) {
      closeMenus();
      setTrainId(selectedFeature?.get("train_id") || null);
      setStationId(selectedFeature?.get("uid") || null);
      setNotificationId(selectedFeature?.get("situationId") || null);
    }
  }, [
    selectedFeature,
    closeMenus,
    setStationId,
    setTrainId,
    setNotificationId,
  ]);

  useEffect(() => {
    if (stationId) {
      closeMenus();

      setTrainId(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [closeMenus, setLinesIds, setNotificationId, setTrainId, stationId]);

  useEffect(() => {
    if (trainId) {
      closeMenus();

      // Close overlay details
      setStationId(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [closeMenus, setLinesIds, setNotificationId, setStationId, trainId]);

  useEffect(() => {
    if (notificationId) {
      closeMenus();

      // Close overlay details
      setStationId(null);
      setLinesIds(null);
      setTrainId(null);
    }
  }, [closeMenus, notificationId, setLinesIds, setStationId, setTrainId]);

  useEffect(() => {
    if (linesIds?.length) {
      closeMenus();

      // Close overlay details
      setStationId(null);
      setNotificationId(null);
      setTrainId(null);
    }
  }, [
    closeMenus,
    linesIds?.length,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    setIsOverlayOpen(
      (hasDetails && !!selectedFeature) ||
        (hasPrint && isExportMenuOpen) ||
        (hasLayerTree && isLayerTreeOpen) ||
        (hasShare && isShareMenuOpen) ||
        (hasRealtime && !!trainId) ||
        (tenant && !!stationId) ||
        (hasLnp && !!linesIds) ||
        (hasNotification && !!notificationId),
    );
  }, [
    hasDetails,
    selectedFeature,
    hasPrint,
    isExportMenuOpen,
    hasLayerTree,
    isLayerTreeOpen,
    hasShare,
    isShareMenuOpen,
    hasRealtime,
    trainId,
    tenant,
    stationId,
    setIsOverlayOpen,
    hasLnp,
    linesIds,
    hasNotification,
    notificationId,
  ]);

  return null;
}

export default LayoutState;
