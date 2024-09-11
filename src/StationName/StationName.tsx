import { memo } from "preact/compat";
import type { PreactDOMAttributes, JSX } from "preact";
import { RealtimeStation } from "mobility-toolbox-js/types";

export type StationNameProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    station: RealtimeStation;
  };

function StationName({ station, children, ...props }: StationNameProps) {
  const { name } = station?.properties || {};
  return (
    <div {...props}>
      {name}
      {children}
    </div>
  );
}

export default memo(StationName);
