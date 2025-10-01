import { memo, useMemo } from "preact/compat";

import OverlayHeader from "../OverlayHeader";
import { LAYERS_NAMES, LAYERS_TITLES } from "../utils/constants";

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
  const title = useMemo(() => {
    let ttle = layer?.get("title");
    if (!ttle) {
      const key = Object.keys(LAYERS_TITLES).find((titleKey) => {
        return LAYERS_NAMES[titleKey] === layer?.get("name");
      });
      ttle = LAYERS_TITLES[key];
    }
    return ttle || layer?.get("name") || "Details";
  }, [layer]);

  return <OverlayHeader title={title} {...props}></OverlayHeader>;
}
export default memo(OverlayDetailsHeader);
