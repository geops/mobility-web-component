import type { JSX, PreactDOMAttributes } from "preact";

import { RealtimeStation } from "mobility-toolbox-js/types";
import { memo } from "preact/compat";

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
