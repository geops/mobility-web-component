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
  const { featuresInfos, selectedFeature, setSelectedFeature } =
    useMapContext();

  const featuresInfo = useMemo(() => {
    return featuresInfos?.find((featureInfo) => {
      return featureInfo?.features.includes(selectedFeature);
    });
  }, [featuresInfos, selectedFeature]);

  if (!selectedFeature || !featuresInfo) {
    return null;
  }
  return (
    <>
      <OverlayDetailsHeader
        feature={selectedFeature}
        layer={featuresInfo?.layer}
        onClose={() => {
          setSelectedFeature(null);
        }}
      />
      <FeatureDetails
        feature={selectedFeature}
        featuresInfo={featuresInfo}
        layer={featuresInfo?.layer}
      />
      <OverlayDetailsFooter
        feature={selectedFeature}
        layer={featuresInfo?.layer}
      />
    </>
  );
}
export default memo(OverlayDetails);
