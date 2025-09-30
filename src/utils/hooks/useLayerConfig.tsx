import { LAYERS_TITLES } from "../constants";

import useLayersConfig from "./useLayersConfig";

import type { LayerConfig } from "./useLayersConfig";

function useLayerConfig(layerName: string) {
  const layersConfig = useLayersConfig();

  // Set defaultstyle if not present in layersconfig
  const layerConfig = layersConfig[layerName] || ({} as LayerConfig);
  if (!layerConfig.title) {
    layerConfig.title = LAYERS_TITLES[layerName];
  }

  return layerConfig;
}

export default useLayerConfig;
