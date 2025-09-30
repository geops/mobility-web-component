import { memo } from "preact/compat";

import OverlayHeader from "../OverlayHeader";
import { LAYERS_TITLES } from "../utils/constants";

import type { Feature } from "ol";
import type BaseLayer from "ol/layer/Base";

import type { OverlayHeaderProps } from "../OverlayHeader/OverlayHeader";

export type OverlayDetailsHeaderProps = {
  feature?: Feature;
  layer?: BaseLayer;
} & OverlayHeaderProps;

function OverlayDetailsHeader({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feature,
  layer,
  ...props
}: OverlayDetailsHeaderProps) {
  return (
    <OverlayHeader
      title={
        layer?.get("title") ||
        LAYERS_TITLES[layer?.get("name")] ||
        layer?.get("name") ||
        "Details"
      }
      {...props}
    ></OverlayHeader>
  );
}
export default memo(OverlayDetailsHeader);
