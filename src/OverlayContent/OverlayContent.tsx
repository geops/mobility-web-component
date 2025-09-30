import { twMerge } from "tailwind-merge";

import ExportMenu from "../ExportMenu";
import LayerTreeMenu from "../LayerTreeMenu";
import RouteSchedule from "../RouteSchedule";
import Search from "../Search";
// import RvfFeatureDetails from "../RvfFeatureDetails";
// import RvfFeatureDetailsFooter from "../RvfFeatureDetailsFooter";
// import RvfFeatureDetailsTitle from "../RvfFeatureDetailsTitle/RvfFeatureDetailsTitle";
// import RvfOverlayHeader from "../RvfOverlayHeader";
import ShareMenu from "../ShareMenu";
import Station from "../Station";
// import { RVF_LAYERS_TITLES } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

const contentClassName = `relative h-full overflow-x-hidden overflow-y-auto text-base bg-white`;

function OverlayContent({
  hasDetails,
  hasLayerTree,
  hasPrint,
  hasRealtime,
  hasSearch,
  hasShare,
}: {
  hasDetails: boolean;
  hasLayerTree: boolean;
  hasPrint: boolean;
  hasRealtime: boolean;
  hasSearch: boolean;
  hasShare: boolean;
}) {
  const {
    isExportMenuOpen,
    isLayerTreeOpen,
    isSearchOpen,
    isShareMenuOpen,
    selectedFeature,
    // setIsExportMenuOpen,
    // setIsLayerTreeOpen,
    // setIsShareMenuOpen,
    // setSelectedFeature,
    // setStationId,
    // setTrainId,
    stationId,
    tenant,
    trainId,
  } = useMapContext();

  console.log("OverlayContent render", selectedFeature);
  return (
    <>
      {hasDetails && selectedFeature && (
        <>
          {hasRealtime && trainId && (
            <>
              {/* <RvfOverlayHeader
            onClose={() => {
              setTrainId(null);
            }}
            title={RVF_LAYERS_TITLES.echtzeit}
          ></RvfOverlayHeader> */}
              <RouteSchedule className={contentClassName} />
            </>
          )}
          {tenant && stationId && (
            <>
              {/* <RvfOverlayHeader
            onClose={() => {
              setStationId(null);
            }}
            title="Station"
          ></RvfOverlayHeader> */}
              <Station
                className={twMerge(contentClassName, "flex flex-col p-2")}
              />
            </>
          )}

          {/* <RvfOverlayHeader
            onClose={() => {
              setSelectedFeature(null);
            }}
            title={<RvfFeatureDetailsTitle feature={selectedFeature} />}
          ></RvfOverlayHeader> */}
          {/* <RvfFeatureDetails
            className={twMerge(contentClassName, "relative")}
      )}

          {/* <RvfOverlayHeader
            onClose={() => {
              setSelectedFeature(null);
            }}
            title={<RvfFeatureDetailsTitle feature={selectedFeature} />}
          ></RvfOverlayHeader> */}
          {/* <RvfFeatureDetails
            className={twMerge(contentClassName, "relative")}
          />
          <RvfFeatureDetailsFooter className={"flex flex-row p-4 pt-2"} /> */}
        </>
      )}
      {hasPrint && isExportMenuOpen && (
        <>
          {/* <RvfOverlayHeader
            onClose={() => {
              setIsExportMenuOpen(false);
            }}
            title="Drucken"
          ></RvfOverlayHeader> */}
          <ExportMenu
            className={twMerge(contentClassName, "flex flex-col gap-4 p-4")}
          />
        </>
      )}
      {hasLayerTree && isLayerTreeOpen && (
        <>
          {/* <RvfOverlayHeader
            onClose={() => {
              setIsLayerTreeOpen(false);
            }}
            title="Layers"
          ></RvfOverlayHeader> */}
          <LayerTreeMenu className="relative flex h-full flex-col overflow-x-hidden overflow-y-auto p-2 text-base *:not-last:border-b" />
        </>
      )}
      {hasShare && isShareMenuOpen && (
        <>
          {/* <RvfOverlayHeader
            onClose={() => {
              setIsShareMenuOpen(false);
            }}
            title="Share"
          ></RvfOverlayHeader> */}
          <ShareMenu className="h-full overflow-x-hidden overflow-y-auto p-4 text-base" />
        </>
      )}
      {hasSearch && isSearchOpen && (
        <>
          <Search className="relative flex h-full flex-col overflow-x-hidden overflow-y-auto p-2 text-base" />
        </>
      )}
    </>
  );
}
export default OverlayContent;
