import { useMemo } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

/**
 * Return x,y,z and layers values from the url. This hook should not managed more usecases than that.
 * The application should be responsible to read url parameters then provides these parameters as attributes to the web-component.
 */
const useInitialPermalink = (
  permalinkTemplate?: string,
): null | Partial<MobilityMapProps> => {
  const { permalinktemplate } = useMapContext();
  const props = useMemo(() => {
    const template = permalinkTemplate || permalinktemplate;

    if (!template) {
      return null;
    }
    try {
      let layers: null | string,
        x: null | string,
        y: null | string,
        z: null | string;

      if (template?.startsWith("?")) {
        const urlSearchParams = new URLSearchParams(template);
        const names = [...urlSearchParams.keys()];
        const nameX = names.find((name) => {
          return urlSearchParams.get(name).includes("{{x}}");
        });
        const nameY = names.find((name) => {
          return urlSearchParams.get(name).includes("{{y}}");
        });
        const nameZ = names.find((name) => {
          return urlSearchParams.get(name).includes("{{z}}");
        });
        const nameLayers = names.find((name) => {
          return urlSearchParams.get(name).includes("{{layers}}");
        });
        const currSearchParams = new URLSearchParams(window.location.search);
        x = currSearchParams.get(nameX);
        y = currSearchParams.get(nameY);
        z = currSearchParams.get(nameZ);
        layers = currSearchParams.get(nameLayers);
      } else if (template?.startsWith("#")) {
        const values = template.substring(1).split("/");
        const currHash = window.location.hash;
        const currIndexes = currHash.substring(1).split("/");
        const indexX = values.findIndex((name) => {
          return name.includes("{{x}}");
        });
        const indexY = values.findIndex((name) => {
          return name.includes("{{y}}");
        });
        const indexZ = values.findIndex((name) => {
          return name.includes("{{z}}");
        });
        const indexLayers = values.findIndex((name) => {
          return name.includes("{{layers}}");
        });
        x = indexX > -1 ? currIndexes[indexX] : null;
        y = indexY > -1 ? currIndexes[indexY] : null;
        z = indexZ > -1 ? currIndexes[indexZ] : null;
        layers = indexLayers > -1 ? currIndexes[indexLayers] : null;
      }
      const propsFromPermalink: Partial<MobilityMapProps> = {};
      if (x && y) {
        propsFromPermalink.center = `${x},${y}`;
      }
      if (z) {
        propsFromPermalink.zoom = z;
      }
      if (layers !== null && layers !== undefined) {
        propsFromPermalink.layers = layers;
      }
      return propsFromPermalink;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        "Impossible to read x,y,z and layers from the url with template",
        template,
        error,
      );
    }
    return null;
  }, [permalinktemplate, permalinkTemplate]);

  return props;
};

export default useInitialPermalink;
