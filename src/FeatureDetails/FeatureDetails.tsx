import { memo } from "preact/compat";

import LinesNetworkPlanDetails from "../LinesNetworkPlanDetails";
import NotificationDetails from "../NotificationDetails";
import RouteSchedule from "../RouteSchedule";
import Station from "../Station";
import useMapContext from "../utils/hooks/useMapContext";

import type { FeatureInfo } from "mobility-toolbox-js/common/typedefs";
import type { Feature } from "ol";
import type BaseLayer from "ol/layer/Base";

const contentClassName = ""; //`h-full overflow-x-hidden text-base bg-white`;

export interface FeatureDetailsProps {
  feature?: Feature;
  featuresInfo?: FeatureInfo;
  layer?: BaseLayer;
}

/**
 * This component is repsonsible to display the details of a feature passed as prop.
 */
function FeatureDetails({ feature, featuresInfo, layer }: FeatureDetailsProps) {
  const {
    linesNetworkPlanLayer,
    notificationsLayer,
    realtimeLayer,
    stationId,
    stationsLayer,
    tenant,
    trainId,
  } = useMapContext();

  if (!feature) {
    return null;
  }

  return (
    <>
      {feature && layer === realtimeLayer && trainId && <RouteSchedule />}
      {feature && layer === stationsLayer && tenant && stationId && <Station />}
      {feature &&
        layer === linesNetworkPlanLayer &&
        featuresInfo?.features?.length && (
          <LinesNetworkPlanDetails
            className={contentClassName}
            features={featuresInfo?.features || []}
          />
        )}
      {feature && layer === notificationsLayer && (
        <NotificationDetails className={contentClassName} feature={feature} />
      )}
    </>
  );
}
export default memo(FeatureDetails);
