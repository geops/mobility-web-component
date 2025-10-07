import { useMemo, useRef } from "preact/hooks";

import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

/**
 * Return x,y and z values from the url. This hook should not managed more usecases than that.
 * The application should be responsible to read url parameters then provides these parameters as attributes to the web-component.
 */
const useInitialPermalink = (
  permalinktemplate: string,
): null | Partial<MobilityMapProps> => {
  const prevProps = useRef<Partial<MobilityMapProps>>(null);

  const props = useMemo(() => {
    if (!permalinktemplate) {
      return null;
    }
    try {
      let x: null | string,
        y: null | string,
        z: null | string = null;

      if (permalinktemplate?.startsWith("?")) {
        const urlSearchParams = new URLSearchParams(permalinktemplate);
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
        const currSearchParams = new URLSearchParams(window.location.search);
        x = currSearchParams.get(nameX);
        y = currSearchParams.get(nameY);
        z = currSearchParams.get(nameZ);
      } else if (permalinktemplate?.startsWith("#")) {
        const values = permalinktemplate.substring(1).split("/");
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
        x = indexX > -1 ? currIndexes[indexX] : null;
        y = indexY > -1 ? currIndexes[indexY] : null;
        z = indexZ > -1 ? currIndexes[indexZ] : null;
      }
      const propsFromPermalink: Partial<MobilityMapProps> = {};
      if (x && y) {
        propsFromPermalink.center = `${x},${y}`;
      }
      if (z) {
        propsFromPermalink.zoom = z;
      }
      return propsFromPermalink;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        "Impossible to read x,y,z from the url with permalinktemplate",
        permalinktemplate,
        error,
      );
    }
    return null;
  }, [permalinktemplate]);

  // We want to apply the value from the url only once
  if (!prevProps.current && props) {
    prevProps.current = props;
    return props;
  }
  return {};
};

export default useInitialPermalink;
