import { memo, useContext } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStop } from "mobility-toolbox-js/types";
import I18nContext from "../I18NContext";

export type RouteStopPlatformProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    stop: RealtimeStop & {
      platform?: string;
    };
    type?: string;
  };

function RouteStopPlatform({
  children,
  stop,
  type,
  ...props
}: RouteStopPlatformProps) {
  const { t } = useContext(I18nContext);
  const { platform } = stop || {};
  if (!platform) {
    return null;
  }
  const translated = t(`platform_${type || "rail"}`);
  return (
    <div {...props}>
      {translated || t(`platform_rail`)} {platform}
      {children}
    </div>
  );
}

export default memo(RouteStopPlatform);
