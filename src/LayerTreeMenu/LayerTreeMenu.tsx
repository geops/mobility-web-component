import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { getUid } from "ol";
import { unByKey } from "ol/Observable";
import { memo, useEffect, useMemo, useState } from "preact/compat";

import LayerTree from "../LayerTree";
import { SelectionType } from "../LayerTree/TreeItem";
import { LAYERS_TITLES } from "../utils/constants";
import useMapContext from "../utils/hooks/useMapContext";

import type { Group } from "ol/layer";
import type BaseLayer from "ol/layer/Base";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { LayerTreeProps } from "../LayerTree/LayerTree";

export interface LayerTreeConfig {
  childItems: LayerTreeConfig[];
  id: string;
  isControlChecked: boolean;
  layer: BaseLayer;
  revision: number;
  selectionType: SelectionType;
  title: string;
}

export type LayerTreeMenuProps = HTMLAttributes<HTMLDivElement> &
  LayerTreeProps &
  PreactDOMAttributes;

const getConfigForLayer = (
  layer: BaseLayer,
  revision: number,
): LayerTreeConfig => {
  return {
    childItems:
      (layer as Group)
        ?.getLayers?.()
        .getArray()
        .map((subLayer) => {
          return getConfigForLayer(subLayer, revision);
        }) || [],
    id: getUid(layer),
    isControlChecked: layer.getVisible(),
    layer,
    revision,
    selectionType: SelectionType.CHECKBOX,
    title: layer.get("title") || LAYERS_TITLES[layer.get("name")],
  };
};

function LayerTreeMenu(props: LayerTreeMenuProps) {
  const { map } = useMapContext();
  const [revision, setRevision] = useState(0);

  const layers: LayerTreeConfig[] = useMemo(() => {
    const config =
      map
        ?.getLayers()
        .getArray()
        .map((layer) => {
          return getConfigForLayer(layer, revision);
        }) || [];
    return config;
  }, [map, revision]);

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
