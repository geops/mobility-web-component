import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import useMapContext from "../utils/hooks/useMapContext";
import useI18n from "../utils/hooks/useI18n";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopPlatformProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLSpanElement>;

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
