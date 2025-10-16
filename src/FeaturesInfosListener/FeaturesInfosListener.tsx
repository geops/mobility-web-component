import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

/**
 * This component defines the behavior when user select or hover a queryable feature
 */
function FeaturesInfosListener() {
  const {
    featuresInfos,
    featuresInfosHovered,
    realtimeLayer,
    setSelectedFeature,
    setSelectedFeatures,
    setStationId,
    setTrainId,
    stationsLayer,
    tenant,
  } = useMapContext();

  useEffect(() => {
    const [realtimeFeature] =
      featuresInfosHovered?.find((info) => {
        return info.layer === realtimeLayer;
      })?.features || [];
    realtimeLayer?.highlight(realtimeFeature);
  }, [featuresInfosHovered, realtimeLayer]);

  useEffect(() => {
    const [realtimeFeature] =
      featuresInfos?.find((info) => {
        return info.layer === realtimeLayer;
      })?.features || [];

    const [stationFeature] =
      featuresInfos?.find((info) => {
        return info.layer === stationsLayer;
      })?.features || [];

    const features =
      featuresInfos?.flatMap((info) => {
        return info.features;
      }) || [];

    if (realtimeFeature || stationFeature || !features.length) {
      setSelectedFeature(realtimeFeature || stationFeature || null);
      setSelectedFeatures(
        realtimeFeature || stationFeature
          ? [realtimeFeature || stationFeature]
          : [],
      );
    } else {
      setSelectedFeatures(features);
      setSelectedFeature(realtimeFeature || stationFeature || features[0]);
    }
  }, [
    featuresInfos,
    realtimeLayer,
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
