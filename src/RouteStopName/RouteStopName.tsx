import type { PreactDOMAttributes, JSX } from "preact";

import { memo } from "preact/compat";

import RouteStopPlatform from "../RouteStopPlatform";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

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
