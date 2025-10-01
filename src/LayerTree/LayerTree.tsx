import { memo } from "preact/compat";
import { useEffect, useReducer } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import {
  LayersTreeContext,
  LayersTreeDispatchContext,
} from "./layersTreeContext";
import layersTreeReducer from "./layersTreeReducer";
import TreeItem from "./TreeItem/TreeItem";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { TreeItemProps } from "./TreeItem/TreeItem";

export type LayerTreeProps = {
  className?: string;
  layers: TreeItemProps[];
  treeItemClassName?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function LayerTree({
  className,
  layers,
  treeItemClassName,
  ...props
}: LayerTreeProps) {
  const [tree, dispatch] = useReducer(layersTreeReducer, layers);

  useEffect(() => {
    dispatch({ payload: layers, type: "INIT" });
  }, [layers]);

  return (
    <LayersTreeContext.Provider value={tree}>
      <LayersTreeDispatchContext.Provider value={dispatch}>
        <div
          className={twMerge("relative flex flex-col", className)}
          {...props}
        >
          {layers.map((item) => {
            return (
              <TreeItem
                className={twMerge("w-full", treeItemClassName)}
                key={item.id}
                {...item}
              />
            );
          })}
        </div>
      </LayersTreeDispatchContext.Provider>
    </LayersTreeContext.Provider>
  );
}

export default memo(LayerTree);
