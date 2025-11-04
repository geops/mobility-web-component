import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import useFitOnFeatures from "../utils/hooks/useFitOnFeatures";
import useMapContext from "../utils/hooks/useMapContext";

import type { GeoJSONFeature } from "maplibre-gl";
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
  const { setStationId, stationsLayer } = useMapContext();
  const fitOnFeatures = useFitOnFeatures();

  return (
    <button
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={() => {
        onSelect?.(stop);
        setStationId(stop.properties.uid);
        stationsLayer?.setVisible(true);
        fitOnFeatures([stop as GeoJSONFeature]);
      }}
      {...props}
    >
      <div className="size-6"></div>
      <div className="grow">{stop.properties.name}</div>
    </button>
  );
}

export default memo(SearchStopsResult);
