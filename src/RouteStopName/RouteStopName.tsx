import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
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
      <RouteStopPlatform className="bg-slate-100 rounded-sm text-xs py-px px-0.5 group-hover:bg-slate-50" />
      {children}
    </div>
  );
}

export default memo(RouteStopName);
