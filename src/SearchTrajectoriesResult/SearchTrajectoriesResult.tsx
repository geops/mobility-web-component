import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";
import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchTrajectoriesResultProps = {
  className?: string;
  onSelect?: (line: RealtimeTrajectory) => void;
  trajectory: RealtimeTrajectory;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchTrajectoriesResult({
  className,
  onSelect,
  trajectory,
  ...props
}: SearchTrajectoriesResultProps) {
  const { realtimeLayer, setTrainId } = useMapContext();
  return (
    <button
      {...props}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={() => {
        realtimeLayer?.setVisible(true);
        onSelect?.(trajectory);
        setTrainId(trajectory.properties.train_id);
      }}
    >
      <RouteIcon trajectory={trajectory}></RouteIcon>
      <div className="grow">{trajectory.properties.route_identifier}</div>
    </button>
  );
}

export default memo(SearchTrajectoriesResult);
