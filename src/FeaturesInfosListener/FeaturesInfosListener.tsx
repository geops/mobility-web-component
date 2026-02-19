import { useEffect } from "preact/hooks";

import { LNP_LINE_ID_PROP } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

/**
 * This component defines the behavior when user select or hover a queryable feature
 */
function FeaturesInfosListener() {
  const {
    baseLayer,
    featuresInfos,
    featuresInfosHovered,
    linesNetworkPlanLayer,
    notificationsLayer,
    realtimeLayer,
    setLinesIds,
    setSelectedFeature,
    setSelectedFeatures,
    setStationId,
    setTrainId,
    stationsLayer,
    tenant,
  } = useMapContext();

  useEffect(() => {
    // We want to call this use effect only when a hover happened
    // and a query has been done not when the component is mounted
    if (!featuresInfosHovered?.length) {
      return;
    }
    const [realtimeFeature] =
      featuresInfosHovered?.find((info) => {
        return info.layer === realtimeLayer;
      })?.features || [];

    const [notificationFeature] =
      featuresInfosHovered?.find((info) => {
        return info.layer === notificationsLayer;
      })?.features || [];

    // We prioritize only symbol notifications, because we want to be able to click on trains on lines
    const isSymbolNotification =
      notificationFeature?.getGeometry()?.getType() === "Point";

    const priorityFeature = isSymbolNotification
      ? notificationFeature || realtimeFeature
      : realtimeFeature || notificationFeature;

    if (priorityFeature === realtimeFeature) {
      realtimeLayer?.highlight(realtimeFeature);
    } else {
      realtimeLayer?.highlight(null);
    }
  }, [featuresInfosHovered, notificationsLayer, realtimeLayer]);

  useEffect(() => {
    // We want to call this use effect only when a click happened
    // and a query has been done not when the component is mounted
    if (!featuresInfos?.length) {
      return;
    }

    const [realtimeFeature] =
      featuresInfos?.find((info) => {
        return info.layer === realtimeLayer;
      })?.features || [];

    const [notificationFeature] =
      featuresInfos?.find((info) => {
        return info.layer === notificationsLayer;
      })?.features || [];

    const [stationFeature] =
      featuresInfos?.find((info) => {
        return info.layer === stationsLayer;
      })?.features || [];

    // Find the line to highlight in the LNP layer
    const linesFeatures =
      featuresInfos?.find((featuresInfo) => {
        return featuresInfo.layer === linesNetworkPlanLayer;
      })?.features || [];

    const linesIds = [
      ...new Set(
        (linesFeatures || []).map((f) => {
          return f.get(LNP_LINE_ID_PROP) as string;
        }),
      ),
    ];

    const features =
      featuresInfos?.flatMap((info) => {
        return info.features;
      }) || [];

    // We prioritize only symbol notifications, because we want to be able to click on trains on lines
    const isSymbolNotification =
      notificationFeature?.getGeometry()?.getType() === "Point";

    let priorityFeature = isSymbolNotification
      ? notificationFeature || realtimeFeature
      : realtimeFeature || notificationFeature;

    priorityFeature = priorityFeature || stationFeature;

    // TODO this if/else must be refactored. We should not have to do setLinesIds here
    if (priorityFeature) {
      setSelectedFeature(priorityFeature);
      setSelectedFeatures([priorityFeature]);
      setLinesIds(null);
    } else if (!features.length) {
      setSelectedFeature(null);
      setSelectedFeatures([]);
      setLinesIds(null);
    } else {
      setSelectedFeatures(features);
      setSelectedFeature(features[0]);
      setLinesIds(linesIds?.length ? linesIds : null);
    }
  }, [
    baseLayer?.mapLibreMap,
    featuresInfos,
    linesNetworkPlanLayer,
    realtimeLayer,
    notificationsLayer,
    setLinesIds,
    setSelectedFeature,
    setSelectedFeatures,
    setStationId,
    setTrainId,
    stationsLayer,
    tenant,
  ]);

  return null;
}
export default FeaturesInfosListener;
