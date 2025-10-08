import { twMerge } from "tailwind-merge";

import ExportMenu from "../ExportMenu";
import LayerTreeMenu from "../LayerTreeMenu";
import OverlayDetails from "../OverlayDetails";
import OverlayHeader from "../OverlayHeader";
import Search from "../Search";
import ShareMenu from "../ShareMenu";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

const contentClassName = `relative h-full overflow-x-hidden overflow-y-auto text-base bg-white`;

function OverlayContent({
  hasDetails,
  hasLayerTree,
  hasPrint,
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
    setIsExportMenuOpen,
    setIsLayerTreeOpen,
    setIsShareMenuOpen,
  } = useMapContext();
  const { t } = useI18n();

  return (
    <>
      {hasDetails && selectedFeature && <OverlayDetails />}
      {hasPrint && isExportMenuOpen && (
        <>
          <OverlayHeader
            onClose={() => {
              setIsExportMenuOpen(false);
            }}
            title={t("print_menu_title")}
          ></OverlayHeader>
          <ExportMenu
            className={twMerge(contentClassName, "flex flex-col gap-4 p-4")}
          />
        </>
      )}
      {hasLayerTree && isLayerTreeOpen && (
        <>
          <OverlayHeader
            onClose={() => {
              setIsLayerTreeOpen(false);
            }}
            title={t("layertree_menu_title")}
          ></OverlayHeader>
          <LayerTreeMenu
            className="relative flex h-full flex-col overflow-x-hidden overflow-y-auto px-4 py-2 text-base *:not-last:border-b"
            treeItemProps={{ childContainerClassName: "*:not-last:border-b" }}
          />
        </>
      )}
      {hasShare && isShareMenuOpen && (
        <>
          <OverlayHeader
            onClose={() => {
              setIsShareMenuOpen(false);
            }}
            title={t("share_menu_title")}
          ></OverlayHeader>
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
