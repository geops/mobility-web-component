import { MaplibreLayer } from "mobility-toolbox-js/ol";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type { MaplibreLayerOptions } from "mobility-toolbox-js/ol/layers/MaplibreLayer";

export type BaseLayerProps = MaplibreLayerOptions;

function BaseLayer(props: BaseLayerProps) {
  const { apikey, baselayer, hasPrint, hasShare, map, mapsurl, setBaseLayer } =
    useMapContext();

  // For printing purpose and bild saving purpose otherwise can be false.
  const preserveDrawingBuffer = useMemo(() => {
    return hasShare || hasPrint;
  }, [hasShare, hasPrint]);

  const layer = useMemo(() => {
    if (!baselayer || !apikey) {
      return;
    }
    return new MaplibreLayer({
      apiKey: apikey,
      style: baselayer,
      url: mapsurl,
      zIndex: 0,

      ...(props || {}),
      mapLibreOptions: {
        // For printing purpose
        maxCanvasSize: [20000, 20000], // remove 4096 limitations
        ...(props?.mapLibreOptions || {}),
        canvasContextAttributes: {
          preserveDrawingBuffer: preserveDrawingBuffer,
          ...(props?.mapLibreOptions?.canvasContextAttributes || {}),
        },
      },
    });
  }, [baselayer, apikey, mapsurl, props, preserveDrawingBuffer]);

  useEffect(() => {
    setBaseLayer(layer);
  }, [layer, setBaseLayer]);

  useEffect(() => {
    if (!map || !layer) {
      return;
    }
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, layer]);

  return null;
}

export default memo(BaseLayer);
