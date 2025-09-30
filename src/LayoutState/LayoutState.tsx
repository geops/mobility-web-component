import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

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
    hasPrint,
    hasRealtime,
    hasShare,
    isExportMenuOpen,
    isLayerTreeOpen,
    isSearchOpen,
    isShareMenuOpen,
    layertree,
    lnp,
    notification,
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
    setStationId,
    setTrainId,
    share,
    stationId,
    tenant,
    toolbar,
    trainId,
  } = useMapContext();

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
    if (isSearchOpen) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsShareMenuOpen(false);
      setStationId(null);
      setTrainId(null);
      setFeaturesInfos(null);
    }
  }, [
    isSearchOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsShareMenuOpen,
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
    }
  }, [
    isShareMenuOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (isLayerTreeOpen) {
      setIsExportMenuOpen(false);
      setIsLayerTreeOpen(isLayerTreeOpen);
      setIsSearchOpen(false);
      setFeaturesInfos(null);
      setTrainId(null);
      setStationId(null);
      setIsShareMenuOpen(false);
    }
  }, [
    isLayerTreeOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
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
      setIsShareMenuOpen(false);
      setStationId(null);
    }
  }, [
    isExportMenuOpen,
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
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
    } else if (!selectedFeature) {
      setTrainId(null);
      setStationId(null);
    }
  }, [
    selectedFeature,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setStationId,
    setTrainId,
  ]);

  useEffect(() => {
    if (stationId) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setTrainId(null);
      setIsShareMenuOpen(false);
    }
  }, [
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setTrainId,
    stationId,
  ]);

  useEffect(() => {
    if (trainId) {
      setIsLayerTreeOpen(false);
      setIsExportMenuOpen(false);
      setIsSearchOpen(false);
      setStationId(null);
      setIsShareMenuOpen(false);
    }
  }, [
    setFeaturesInfos,
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsSearchOpen,
    setIsShareMenuOpen,
    setStationId,
    trainId,
  ]);

  useEffect(() => {
    setIsOverlayOpen(
      (hasDetails && !!selectedFeature) ||
        (hasPrint && isExportMenuOpen) ||
        (hasLayerTree && isLayerTreeOpen) ||
        (hasShare && isShareMenuOpen) ||
        (hasRealtime && !!trainId) ||
        (tenant && !!stationId),
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
  ]);

  return null;
}

export default LayoutState;
