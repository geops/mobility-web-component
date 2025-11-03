import { useEffect } from "preact/hooks";

import useLnpLineInfo, { useLnpStopInfo } from "../utils/hooks/useLnp";
import useMapContext from "../utils/hooks/useMapContext";
import useRealtimeRenderedTrajectories from "../utils/hooks/useRealtimeRenderedTrajectory";

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
  const trainInfo = useRealtimeRenderedTrajectories(trainid);

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

  useEffect(() => {
    // @ts-expect-error bad typing
    setStationId(stopInfo?.external_id);
  }, [stopInfo, setStationId]);

  useEffect(() => {
    setNotificationId(notificationid);
  }, [notificationid, setNotificationId]);

  useEffect(() => {
    setTrainId(trainInfo?.properties?.train_id);
  }, [setTrainId, trainInfo]);

  useEffect(() => {
    if (isSearchOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsShareMenuOpen(false);
      setStationId(null);
      setTrainId(null);
      setFeaturesInfos(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [
    isSearchOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (isShareMenuOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setStationId(null);
      setTrainId(null);
      setFeaturesInfos(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [
    isShareMenuOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (isLayerTreeOpen) {
      setIsExportMenuOpen(false);
      setIsLayerTreeOpen(isLayerTreeOpen);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);
      setFeaturesInfos(null);
      setTrainId(null);
      setStationId(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [
    isLayerTreeOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (isExportMenuOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(isExportMenuOpen);
      setIsSearchOpen(false);
      setFeaturesInfos(null);
      setTrainId(null);
      setLinesIds(null);
      setIsShareMenuOpen(false);
      setStationId(null);
      setNotificationId(null);
    }
  }, [
    isExportMenuOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (selectedFeature) {
      setIsLayerTreeOpen(false);
      setIsSearchOpen(false);
      setIsExportMenuOpen(false);
      setIsShareMenuOpen(false);
      setTrainId(selectedFeature?.get("train_id") || null);
      setStationId(selectedFeature?.get("uid") || null);
      setNotificationId(selectedFeature?.get("situationId") || null);
    }
  }, [
    selectedFeature,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setStationId,
    setTrainId,
    setNotificationId,
  ]);

  useEffect(() => {
    if (stationId) {
      // Close tools
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      // Close overlay details
      setTrainId(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setTrainId,
    stationId,
  ]);

  useEffect(() => {
    if (trainId) {
      // Close tools
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      // Close overlay details
      setStationId(null);
      setLinesIds(null);
      setNotificationId(null);
    }
  }, [
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    trainId,
  ]);

  useEffect(() => {
    if (notificationId) {
      // Close tools
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      // Close overlay details
      setStationId(null);
      setLinesIds(null);
      setTrainId(null);
    }
  }, [
    notificationId,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (linesIds?.length) {
      // Close tools
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setIsShareMenuOpen(false);

      // Close overlay details
      setStationId(null);
      setNotificationId(null);
      setTrainId(null);
    }
  }, [
    linesIds?.length,
    notificationId,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setLinesIds,
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
