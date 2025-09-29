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
      layer.setVisible(shouldBeVisible);

      if ((layer as Group).getLayers) {
        (layer as Group)
          .getLayers()
          .getArray()
          .forEach((subLayer) => {
            subLayer.setVisible(shouldBeVisible);
            // applyInitialLayerVisibility(layersAttrValue, subLayer);
          });
      }
    }
  }
  if ((layer as Group).getLayers) {
    (layer as Group)
      .getLayers()
      .getArray()
      .forEach((subLayer) => {
        // subLayer.setVisible(false);
        applyInitialLayerVisibility(layersAttrValue, subLayer);
      });
  }
};
export default applyInitialLayerVisibility;
