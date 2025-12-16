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
    // Visiblity of group are defined by their children, they should not appear in the permalink.
    if (layer.getVisible() !== shouldBeVisible && !(layer as Group).getLayers) {
      layer.setVisible(shouldBeVisible);
    }
  }
};
export default applyInitialLayerVisibility;
