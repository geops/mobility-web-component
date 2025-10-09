import { memo } from "preact/compat";
import { useMemo } from "preact/hooks";

import FeatureDetails from "../FeatureDetails";
import OverlayDetailsFooter from "../OverlayDetailsFooter";
import OverlayDetailsHeader from "../OverlayDetailsHeader";
import useMapContext from "../utils/hooks/useMapContext";

/**
 * This component is responsible to display the informations about the selectedFeature prop
 * in the Overlay component.
 */
function OverlayDetails() {
  const {
    featuresInfos,
    realtimeLayer,
    selectedFeature,
    setFeaturesInfos,
    setStationId,
    setTrainId,
    stationId,
    stationsLayer,
    trainId,
  } = useMapContext();

  const featuresInfo = useMemo(() => {
    return featuresInfos?.find((featureInfo) => {
      return featureInfo?.features.includes(selectedFeature);
    });
  }, [featuresInfos, selectedFeature]);

  const layer = useMemo(() => {
    if (featuresInfo?.layer) {
      return featuresInfo.layer;
    }
    if (trainId) {
      return realtimeLayer;
    }
    if (stationId) {
      return stationsLayer;
    }
    return undefined;
  }, [featuresInfo?.layer, realtimeLayer, stationId, stationsLayer, trainId]);

  return (
    <>
      <OverlayDetailsHeader
        feature={selectedFeature}
        layer={layer}
        onClose={() => {
          setFeaturesInfos(null);
          setTrainId(null);
          setStationId(null);
        }}
      />
      <FeatureDetails
        feature={selectedFeature}
        featuresInfo={featuresInfo}
        layer={layer}
      />
      <OverlayDetailsFooter feature={selectedFeature} layer={layer} />
    </>
  );
}
export default memo(OverlayDetails);
