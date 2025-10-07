import { useEffect, useState } from "preact/hooks";

import { LAYERS_NAMES } from "../constants";

import useMapContext from "./useMapContext";

export interface LayerConfig {
  link?: {
    href?: string;
    show?: boolean;
    text?: string;
  };
  title?: string;
}
export type LayersConfig = Record<string, LayerConfig>;

function useLayersConfig() {
  const { layersconfig } = useMapContext();
  const [layersConfig, setLayersConfig] = useState<LayersConfig>({});

  useEffect(() => {
    try {
      const config = JSON.parse(layersconfig || "{}");

      // Set the default title if not present in layersconfig
      Object.values(LAYERS_NAMES).forEach((name) => {
        config[name] = {
          title: name,
          ...(config[name] || {}),
        };
      });
      setLayersConfig(config);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error parsing layersconfig:", error);
    }
  }, [layersconfig]);

  return layersConfig;
}

export default useLayersConfig;
