import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { StopsFeature } from "../StopsSearch";

export type SearchStopsResultProps = {
  className?: string;
  onSelect?: (stop: StopsFeature) => void;
  stop: StopsFeature;
} & HTMLAttributes<HTMLLIElement> &
  PreactDOMAttributes;

function SearchStopsResult({
  className,
  onSelect,
  stop,
  ...props
}: SearchStopsResultProps) {
  const { map } = useMapContext();

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
          centerOnStation(stop, map);
          onSelect?.(stop);
        }}
      >
        <div className="size-6"></div>
        <div className="grow">{stop.properties.name}</div>
      </button>
    </li>
  );
}

export default memo(SearchStopsResult);
