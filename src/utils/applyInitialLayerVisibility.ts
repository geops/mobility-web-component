import type { Group } from "ol/layer";
import type BaseLayer from "ol/layer/Base";

const applyInitialLayerVisibility = (
  layersAttrValue: string,
  layer: BaseLayer,
) => {
  const isPermalinkable = !!layer.get("name");
  const hasLayersAttribute =
    isPermalinkable &&
    !!(layersAttrValue !== null && layersAttrValue !== undefined);

  if (hasLayersAttribute) {
    const names = layersAttrValue?.split(",") || [];
    const name = layer.get("name");
    const shouldBeVisible = names.includes(name);
    if (layer.getVisible() !== shouldBeVisible) {
      // If the layer is a group we apply the visibility to its sublayers,
      // not the group itself. Group should not appear in permalink layers param
      if ((layer as Group).getLayers) {
        (layer as Group)
          .getLayers()
          .getArray()
          .forEach((subLayer) => {
            applyInitialLayerVisibility(layersAttrValue, subLayer);
          });
      } else {
        layer.setVisible(shouldBeVisible);
      }
    }
  }

  // if the layer is a group we set it to false if all its sublayers are false
  if ((layer as Group).getLayers) {
    if (
      layer.getVisible() &&
      !(layer as Group)
        .getLayers()
        ?.getArray()
        .find((l) => {
          return l.getVisible();
        })
    ) {
      layer.setVisible(false);
    }
  }
};
export default applyInitialLayerVisibility;
