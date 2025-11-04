import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import centerOnStation from "../utils/centerOnStation";
import useMapContext from "../utils/hooks/useMapContext";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

import type { StopsFeature } from "../utils/hooks/useSearchStops";

export type SearchStopsResultProps = {
  className?: string;
  onSelect?: (stop: StopsFeature) => void;
  stop: StopsFeature;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchStopsResult({
  className,
  onSelect,
  stop,
  ...props
}: SearchStopsResultProps) {
  const { map, stationsLayer } = useMapContext();

  return (
    <button
      {...props}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={() => {
        stationsLayer?.setVisible(true);
        centerOnStation(stop, map);
        onSelect?.(stop);
      }}
    >
      <div className="size-6"></div>
      <div className="grow">{stop.properties.name}</div>
    </button>
  );
}

export default memo(SearchStopsResult);
