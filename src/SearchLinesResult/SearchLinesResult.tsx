import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

import type { LnpLineInfo } from "../utils/hooks/useLnp";

export type SearchLinesResultProps = {
  className?: string;
  item?: LnpLineInfo;
  onSelectItem?: (line: LnpLineInfo) => void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchLinesResult({
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
      <RouteIcon lineInfo={item}></RouteIcon>
      <div className="grow">{item?.long_name || item?.short_name}</div>
    </button>
  );
}

export default memo(SearchLinesResult);
