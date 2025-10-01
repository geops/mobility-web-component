import Group from "ol/layer/Group";

import type { Collection } from "ol";
import type BaseLayer from "ol/layer/Base";

const getAllLayers = (
  layersOrLayerGroup: BaseLayer[] | Collection<BaseLayer> | Group,
) => {
  const allLayers = [];
  function addLayersFrom(layers: BaseLayer[] | Collection<BaseLayer>) {
    layers.forEach(function (layer) {
      if (layer instanceof Group) {
        addLayersFrom(layer.getLayers());
      } else {
        allLayers.push(layer);
      }
    });
  }
  addLayersFrom(
    (layersOrLayerGroup as Group)?.getLayers?.() ||
      (layersOrLayerGroup as BaseLayer[] | Collection<BaseLayer>),
  );
  return allLayers;
};

export default getAllLayers;
