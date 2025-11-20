import { memo } from "preact/compat";

import OverlayHeader from "../OverlayHeader";
import useI18n from "../utils/hooks/useI18n";
import useLayerConfig from "../utils/hooks/useLayerConfig";

import type { Feature } from "ol";
import type BaseLayer from "ol/layer/Base";

import type { OverlayHeaderProps } from "../OverlayHeader/OverlayHeader";

export type OverlayDetailsHeaderProps = {
  feature?: Feature;
  layer?: BaseLayer;
} & OverlayHeaderProps;

function OverlayDetailsHeader({ layer, ...props }: OverlayDetailsHeaderProps) {
  const { t } = useI18n();
  const layerConfig = useLayerConfig(layer?.get("name"));
  if (!layer) {
    return null;
  }
  return (
    <OverlayHeader
      title={t(layerConfig?.title || "")}
      {...props}
    ></OverlayHeader>
  );
}
export default memo(OverlayDetailsHeader);
