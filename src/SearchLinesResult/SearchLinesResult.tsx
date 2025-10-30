import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { LineInfo } from "../utils/hooks/useLnp";

export type SearchLinesResultProps = {
  className?: string;
  line: LineInfo;
  onSelect?: (line: LineInfo) => void;
} & HTMLAttributes<HTMLLIElement> &
  PreactDOMAttributes;

function SearchLinesResult({
  className,
  line,
  onSelect,
  ...props
}: SearchLinesResultProps) {
  const { setLinesIds } = useMapContext();
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
          onSelect?.(line);
          setLinesIds([line.external_id]);
        }}
      >
        <RouteIcon line={{ ...line, name: line.short_name }}></RouteIcon>
        <div className="grow">{line.short_name || line.long_name}</div>
      </button>
    </li>
  );
}

export default memo(SearchLinesResult);
