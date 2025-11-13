import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeRouteIdentifierMatch } from "mobility-toolbox-js/types";
import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchTrainsResultProps = {
  className?: string;
  item?: RealtimeRouteIdentifierMatch;
  onSelectItem?: (item: RealtimeRouteIdentifierMatch, evt: MouseEvent) => void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchTrainsResult({
  className,
  item,
  onSelectItem,
  ...props
}: SearchTrainsResultProps) {
  const { realtimeLayer } = useMapContext();
  return (
    <button
      {...props}
      className={twMerge(
        "flex w-full cursor-pointer items-center gap-3 text-left",
        className,
      )}
      onClick={(evt) => {
        realtimeLayer?.setVisible(true);
        onSelectItem?.(item, evt);
      }}
    >
      <RouteIcon line={item.line}></RouteIcon>
      <div className="grow">{`${item.destination} (${item.route_identifier})`}</div>
    </button>
  );
}

export default memo(SearchTrainsResult);
