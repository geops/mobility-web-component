import { memo } from "preact/compat";

import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";
import useRouteStop from "../utils/hooks/useRouteStop";

import type { JSX, PreactDOMAttributes } from "preact";

export type RouteStopPlatformProps = JSX.HTMLAttributes<HTMLSpanElement> &
  PreactDOMAttributes;

function RouteStopPlatform({ ...props }: RouteStopPlatformProps) {
  const { stop } = useRouteStop();
  const { stopSequence } = useMapContext();
  const { type } = stopSequence;
  const { t } = useI18n();
  const { platform } = stop || {};
  if (!platform) {
    return null;
  }
  const translated = t(`platform_${type || "rail"}`);
  return (
    <span {...props}>
      {translated || t(`platform_rail`)} {platform}
    </span>
  );
}

export default memo(RouteStopPlatform);
