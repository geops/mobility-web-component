import { memo } from "preact/compat";
import { useEffect, useReducer } from "preact/hooks";

import {
  LayersTreeContext,
  LayersTreeDispatchContext,
} from "./layersTreeContext";
import layersTreeReducer from "./layersTreeReducer";
import TreeItem from "./TreeItem/TreeItem";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { TreeItemProps } from "./TreeItem/TreeItem";

export type LayerTreeProps = {
  layers: TreeItemProps[];
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function LayerTree({ layers, ...props }: LayerTreeProps) {
  const [tree, dispatch] = useReducer(layersTreeReducer, layers);

  useEffect(() => {
    dispatch({ payload: layers, type: "INIT" });
  }, [layers]);

  return (
    <LayersTreeContext.Provider value={tree}>
      <LayersTreeDispatchContext.Provider value={dispatch}>
        <div {...props}>
          {layers.map((item) => {
            return <TreeItem className="w-full" key={item.id} {...item} />;
          })}
        </div>
      </LayersTreeDispatchContext.Provider>
    </LayersTreeContext.Provider>
  );
}

export default memo(LayerTree);
