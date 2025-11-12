import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";
import { useEffect, useRef } from "preact/hooks";

import useFitOnFeatures from "./useFitOnFeatures";

import type { GeoJSONFeature } from "ol/format/GeoJSON";

import type { LnpLineInfo, LnpStopInfo } from "./useLnp";
import type { StopsFeature } from "./useSearchStops";

export type FitOnObject = (obj: FitObject, willOverlayOpen?: boolean) => void;

export type FitObject = LnpLineInfo | LnpStopInfo | StopsFeature;

function useFit() {
  const fitOnFeatures = useFitOnFeatures();
  const fit = useRef<FitOnObject>();

  useEffect(() => {
    fit.current = (obj: FitObject, willOverlayOpen = false) => {
      if (
        (obj as StopsFeature)?.type === "Feature" &&
        (obj as StopsFeature).geometry
      ) {
        fitOnFeatures.current([obj as GeoJSONFeature], willOverlayOpen);
        return;
      }

      const extent = (obj as LnpLineInfo)?.extent;
      if (extent) {
        const feature = new Feature(fromExtent(extent));
        fitOnFeatures.current([feature], willOverlayOpen);
        return;
      }

      const coordinate = (obj as LnpStopInfo)?.coordinates;
      if (coordinate) {
        const feature = new Feature(new Point(coordinate));
        fitOnFeatures.current([feature], willOverlayOpen);
        return;
      }
    };
  }, [fitOnFeatures]);

  return fit;
}

export default useFit;
