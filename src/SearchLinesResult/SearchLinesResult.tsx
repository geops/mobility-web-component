import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

import type { LnpLineInfo } from "../utils/hooks/useLnp";

export type SearchLinesResultProps = {
  className?: string;
  line: LnpLineInfo;
  onSelect?: (line: LnpLineInfo) => void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchLinesResult({
  className,
  line,
  onSelect,
  ...props
}: SearchLinesResultProps) {
  const { linesNetworkPlanLayer, setLinesIds } = useMapContext();
  return (
    <button
      {...props}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={() => {
        linesNetworkPlanLayer?.setVisible(true);
        onSelect?.(line);
        setLinesIds([line.external_id]);
      }}
    >
      <RouteIcon lineInfo={line}></RouteIcon>
      <div className="grow">{line.long_name || line.short_name}</div>
    </button>
  );
}

export default memo(SearchLinesResult);
