import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import RouteStopName from "../RouteStopName";
import RouteStopServices from "../RouteStopServices";

export type RouteStopStationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function RouteStopStation({ children, ...props }: RouteStopStationProps) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <RouteStopName />
      <RouteStopServices className="flex flex-wrap gap-1" />
      {children}
    </div>
  );
}
export default memo(RouteStopStation);
