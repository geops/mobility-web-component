// Ad a source and styleLayer using the id in parameter.
const addSourceAndLayers = (
  mapboxLayer,
  sourceId,
  sourceData,
  styleLayer,
  beforeLayerId,
) => {
  if (!mapboxLayer.loaded) {
    mapboxLayer.once('load', () => {
      addSourceAndLayers(
        mapboxLayer,
        sourceId,
        sourceData,
        styleLayer,
        beforeLayerId,
      );
    });
    return;
  }
  const { mbMap } = mapboxLayer;

  // Update source
  if (sourceId && sourceData) {
    const source = mbMap.getSource(sourceId);
    if (source) {
      source.setData(sourceData.data);
    } else {
      mbMap.addSource(sourceId, sourceData);
    }
  }

  // Update layer
  if (styleLayer) {
    let layer = mbMap.getLayer(sourceId);
    if (layer) {
      mbMap.removeLayer(layer.id);
    }

    // styleLayer could be an array of styles to add.
    let styleLayers = styleLayer;
    if (!Array.isArray(styleLayer)) {
      styleLayers = [styleLayer];
    }
    styleLayers.forEach((style) => {
      if (mbMap.getSource(style.source)) {
        layer = mbMap.getLayer(style.id);
        if (layer) {
          mbMap.removeLayer(layer.id);
        }
        mbMap.addLayer(style, beforeLayerId);
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `The source ${style.source} doesn't exist. This layer can't be added`,
          style,
        );
      }
    });
  }
};

export default addSourceAndLayers;
