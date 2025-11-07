import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteStopName from "../RouteStopName";
import RouteStopServices from "../RouteStopServices";
import useRouteStop from "../utils/hooks/useRouteStop";

import type { JSX, PreactDOMAttributes } from "preact";

export type RouteStopStationProps = {
  className?: string;
  classNameCancelled?: string;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function RouteStopStation({
  children,
  className = "flex items-center gap-2 w-full",
  classNameCancelled = "text-red-600 line-through",
  ...props
}: RouteStopStationProps) {
  const { status } = useRouteStop();

  return (
    <div
      {...props}
      className={twMerge(
        className,
        status.isCancelled ? classNameCancelled : "",
      )}
    >
      <RouteStopName className={"grow"} />
      <RouteStopServices className="flex shrink-0 flex-wrap gap-1" />
      {children}
    </div>
  );
}
export default memo(RouteStopStation);
