import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeTrajectory } from "mobility-toolbox-js/types";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchTrajectoriesResultProps = {
  className?: string;
  onSelect?: (line: RealtimeTrajectory) => void;
  trajectory: RealtimeTrajectory;
} & HTMLAttributes<HTMLLIElement> &
  PreactDOMAttributes;

function SearchTrajectoriesResult({
  className,
  onSelect,
  trajectory,
  ...props
}: SearchTrajectoriesResultProps) {
  const { setTrainId } = useMapContext();
  return (
    <li
      {...props}
      className={twMerge(
        "border-b border-dashed border-slate-300 p-3 last:border-0",
        className,
      )}
    >
      <button
        className="flex w-full cursor-pointer items-center gap-3 text-left"
        onClick={() => {
          onSelect?.(trajectory);
          setTrainId(trajectory.properties.train_id);
        }}
      >
        <RouteIcon trajectory={trajectory}></RouteIcon>
        <div className="grow">{trajectory.properties.route_identifier}</div>
      </button>
    </li>
  );
}

export default memo(SearchTrajectoriesResult);
