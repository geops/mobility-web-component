import { memo } from "preact/compat";
import { PreactDOMAttributes, JSX } from "preact";
import RouteStopName from "../RouteStopName";
import RouteStopServices from "../RouteStopServices";
import useRouteStop from "../utils/hooks/useRouteStop";

export type RouteStopStationProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    classNameCancelled?: string;
  };

function RouteStopStation({ children, ...props }: RouteStopStationProps) {
  const { status } = useRouteStop();
  const classNameCancelled = status.isCancelled
    ? "text-red-600 line-through"
    : "";

  return (
    <div
      {...props}
      className={`${
        props.className || "flex items-center gap-2"
      } ${classNameCancelled}`}
    >
      <RouteStopName />
      <RouteStopServices className="flex flex-wrap gap-1" />
      {children}
    </div>
  );
}
export default memo(RouteStopStation);
