import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { getUid } from "ol";
import { unByKey } from "ol/Observable";
import { memo, useEffect, useMemo, useState } from "preact/compat";

import LayerTree from "../LayerTree";
import { SelectionType } from "../LayerTree/TreeItem";
import { LAYER_TREE_ORDER } from "../utils/constants";
import useLayersConfig from "../utils/hooks/useLayersConfig";
import useMapContext from "../utils/hooks/useMapContext";

import type { Group } from "ol/layer";
import type BaseLayer from "ol/layer/Base";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { LayerTreeProps } from "../LayerTree/LayerTree";
import type { LayerConfig } from "../utils/hooks/useLayersConfig";

export interface LayerTreeConfig {
  childItems: LayerTreeConfig[];
  id: string;
  isControlChecked: boolean;
  layer: BaseLayer;
  revision: number;
  selectionType: SelectionType;
  title: string;
}

export type LayerTreeMenuProps = {
  filter?: (layer: BaseLayer) => boolean;
  order: string[];
} & HTMLAttributes<HTMLDivElement> &
  Partial<LayerTreeProps> &
  PreactDOMAttributes;

const getConfigForLayer = (
  layer: BaseLayer,
  revision: number,
  layersConfig: Record<string, LayerConfig> = {},
): LayerTreeConfig => {
  const defaultTitle = layersConfig[layer.get("name")]?.title || "";
  const customTitleFunction = layer.get("layerTreeTitle");
  let title = defaultTitle;
  if (typeof customTitleFunction === "function") {
    title = customTitleFunction(title);
  }

  return {
    childItems:
      (layer as Group)
        ?.getLayers?.()
        .getArray()
        .map((subLayer) => {
          return getConfigForLayer(subLayer, revision, layersConfig);
        }) || [],
    id: getUid(layer),
    isControlChecked: layer.getVisible(),
    layer,
    revision,
    selectionType: SelectionType.CHECKBOX,
    title,
  };
};

function LayerTreeMenu({
  filter,
  order = LAYER_TREE_ORDER,
  ...props
}: LayerTreeMenuProps) {
  const { map } = useMapContext();
  const [revision, setRevision] = useState(0);
  const layersConfig = useLayersConfig();

  const layers: LayerTreeConfig[] = useMemo(() => {
    const config =
      map
        ?.getLayers()
        .getArray()
        .filter(
          filter ??
            (() => {
              return true;
            }),
        )
        .sort((a, b) => {
          if (
            order &&
            order.indexOf(a.get("name")) > order.indexOf(b.get("name"))
          ) {
            return 1;
          } else {
            return -1;
          }
        })
        .map((layer) => {
          return getConfigForLayer(layer, revision, layersConfig);
        }) || [];
    return config;
  }, [filter, layersConfig, map, order, revision]);

  // Force update of config when a layers`s visibility changes progammatically
  useEffect(() => {
    const keys = [];
    const layerss = getLayersAsFlatArray(map.getLayers().getArray());
    layerss.forEach((layer) => {
      const key = layer.on("change:visible", () => {
        setRevision((prev) => {
          return prev + 1;
        });
      });
      keys.push(key);
    });
    keys.push(
      map.on("change:layergroup", () => {
        setRevision((prev) => {
          return prev + 1;
        });
      }),
      map.getLayers().on("add", () => {
        setRevision((prev) => {
          return prev + 1;
        });
      }),
      map.getLayers().on("remove", () => {
        setRevision((prev) => {
          return prev + 1;
        });
      }),
    );
    return () => {
      // Clean up all listeners
      unByKey(keys);
    };
  }, [map]);

  return <LayerTree layers={layers} {...props} />;
}

export default memo(LayerTreeMenu);
