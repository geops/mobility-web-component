import type { JSX, PreactDOMAttributes } from "preact";

import { memo } from "preact/compat";

import RouteStopPlatform from "../RouteStopPlatform";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopNameProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteStopName({ children, ...props }: RouteStopNameProps) {
  const { stop } = useRouteStop();
  const { stationName } = stop || {};
  return (
    <div {...props}>
      {stationName}
      <br />
      <RouteStopPlatform className="rounded-sm bg-slate-100 px-0.5 py-px text-xs group-hover:bg-slate-50" />
      {children}
    </div>
  );
}

export default memo(RouteStopName);
