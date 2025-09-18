import { memo } from "preact/compat";

import type { RealtimeStation } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type StationNameProps = {
  station: RealtimeStation;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function StationName({ children, station, ...props }: StationNameProps) {
  const { name } = station?.properties || {};
  return (
    <div {...props}>
      {name}
      {children}
    </div>
  );
}

export default memo(StationName);
