import { memo, useId, useState } from "preact/compat";

import Button from "../ui/Button";
import Checkbox from "../ui/Checkbox";
import Select from "../ui/Select";
import { LAYER_PROP_IS_EXPORTING, MAX_EXTENT } from "../utils/constants";
import exportPdf from "../utils/exportPdf";
import getAllLayers from "../utils/getAllLayers";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type ExportMenuButtonProps = HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

const formats = ["A4", "A3", "A1", "A0"];

let prevRealtimeLayerVisibility = false;

function ExportMenu({ ...props }: ExportMenuButtonProps) {
  const { map, realtimeLayer } = useMapContext();
  const [useMaxExtent, setUseMaxExtent] = useState(false);
  const [format, setFormat] = useState<string>(formats[0]);
  const checkboxId = useId();
  const selectId = useId();
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingError, setIsExportingError] = useState(false);
  const { t } = useI18n();
  return (
    <div {...props}>
      {/* <!-- Content --> */}
      <div className="flex flex-1 flex-col gap-4">
        <div className={"flex flex-wrap items-center gap-2"}>
          <Checkbox
            checked={useMaxExtent}
            id={checkboxId}
            onChange={() => {
              return setUseMaxExtent(!useMaxExtent);
            }}
          />
          <label htmlFor={checkboxId}>{t("export_all_region")}</label>
        </div>
        <div className={"flex flex-wrap items-center gap-2"}>
          <label htmlFor={selectId}>{t("export_format_title")}:</label>
          <Select
            className={"w-24"}
            id={selectId}
            onChange={(evt) => {
              setFormat((evt.target as HTMLSelectElement).value);
            }}
          >
            {formats.map((formatt) => {
              return <option key={formatt}>{formatt}</option>;
            })}
          </Select>
        </div>
      </div>
      {/* <!-- Footer --> */}
      <div>
        <Button
          disabled={isExporting}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            setIsExportingError(false);
            setIsExporting(true);
            const result = await exportPdf(
              map,
              { format },
              {
                maxExtent: useMaxExtent ? MAX_EXTENT : undefined,

                onAfter: (mapp, layers) => {
                  if (
                    realtimeLayer &&
                    prevRealtimeLayerVisibility !== realtimeLayer?.getVisible()
                  ) {
                    realtimeLayer.setVisible(prevRealtimeLayerVisibility);
                  }
                  getAllLayers(layers).forEach((layer) => {
                    layer.set(LAYER_PROP_IS_EXPORTING, false);
                  });
                  mapp.set(LAYER_PROP_IS_EXPORTING, false);
                },
                onBefore: (mapp, layers) => {
                  mapp.set(LAYER_PROP_IS_EXPORTING, true);
                  if (realtimeLayer) {
                    prevRealtimeLayerVisibility = realtimeLayer.getVisible();
                    if (realtimeLayer.getVisible()) {
                      realtimeLayer.setVisible(false);
                    }
                  }
                  getAllLayers(layers).forEach((layer) => {
                    layer.set(LAYER_PROP_IS_EXPORTING, true);
                  });
                },
              },
            );
            setTimeout(() => {
              setIsExporting(false);
              setIsExportingError(!result);
            }, 1000);
          }}
        >
          {isExporting && t("exporting")}
          {!isExporting && isExportingError && t("error")}
          {!isExporting && !isExportingError && t("download")}
        </Button>
      </div>
    </div>
  );
}

export default memo(ExportMenu);
