import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import useMapContext from "../utils/hooks/useMapContext";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

import type { LnpStopInfo } from "../utils/hooks/useLnp";

export type SearchLinesResultProps = {
  className?: string;
  item?: LnpStopInfo;
  onSelectItem?: (line: LnpStopInfo) => void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchLnpStopsResult({
  className,
  item,
  onSelectItem,
  ...props
}: SearchLinesResultProps) {
  const { linesNetworkPlanLayer } = useMapContext();
  return (
    <button
      {...props}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={() => {
        linesNetworkPlanLayer?.setVisible(true);
        onSelectItem?.(item);
      }}
    >
      <div className="size-6"></div>
      <div className="grow">{item?.long_name || item?.short_name}</div>
    </button>
  );
}

export default memo(SearchLnpStopsResult);
