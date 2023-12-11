import { memo, useContext } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStop } from "mobility-toolbox-js/types";
import I18nContext from "../I18NContext";
import useMapContext from "../utils/hooks/useMapContext";

export type RouteStopPlatformProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stop: RealtimeStop & {
      platform?: string;
    };
  };

function RouteStopPlatform({ stop }: RouteStopPlatformProps) {
  const { stopSequence } = useMapContext();
  const { type } = stopSequence;
  const { t } = useContext(I18nContext);
  const { platform } = stop || {};
  if (!platform) {
    return null;
  }
  const translated = t(`platform_${type || "rail"}`);
  return (
    <>
      {translated || t(`platform_rail`)} {platform}
    </>
  );
}

export default memo(RouteStopPlatform);
