import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import useMapContext from "../utils/hooks/useMapContext";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

import type { StopsFeature } from "../utils/hooks/useSearchStops";

export type SearchStopsResultProps = {
  className?: string;
  item?: StopsFeature;
  onSelectItem?: (stop: StopsFeature, evt: MouseEvent) => void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchStopsResult({
  className,
  item,
  onSelectItem,
  ...props
}: SearchStopsResultProps) {
  const { stationsLayer } = useMapContext();

  return (
    <button
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={(evt) => {
        stationsLayer?.setVisible(true);
        onSelectItem?.(item, evt);
      }}
      {...props}
    >
      <div className="size-6"></div>
      <div className="grow">{item?.properties.name}</div>
    </button>
  );
}

export default memo(SearchStopsResult);
