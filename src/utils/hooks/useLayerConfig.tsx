import useLayersConfig from "./useLayersConfig";

import type { LayerConfig } from "./useLayersConfig";

function useLayerConfig(layerName: string) {
  const layersConfig = useLayersConfig();

  // Set defaultstyle if not present in layersconfig
  const layerConfig = layersConfig[layerName] || ({} as LayerConfig);
  if (!layerConfig.title) {
    layerConfig.title = layerName;
  }

  return layerConfig;
}

export default useLayerConfig;
