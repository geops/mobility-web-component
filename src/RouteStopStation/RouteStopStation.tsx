import { PreactDOMAttributes, JSX } from "preact";
import { memo } from "preact/compat";

import RouteStopName from "../RouteStopName";
import RouteStopServices from "../RouteStopServices";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopStationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    classNameCancelled?: string;
  };

function RouteStopStation({
  children,
  className = "flex items-center gap-2",
  classNameCancelled = "text-red-600 line-through",
  ...props
}: RouteStopStationProps) {
  const { status } = useRouteStop();

  return (
    <div
      {...props}
      className={`${className} ${status.isCancelled ? classNameCancelled : ""}`}
    >
      <RouteStopName />
      <RouteStopServices className="flex flex-wrap gap-1" />
      {children}
    </div>
  );
}
export default memo(RouteStopStation);
