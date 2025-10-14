import { Map as OlMap, View } from "ol";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useEffect, useMemo, useRef } from "preact/hooks";

import useInitialPermalink from "../utils/hooks/useInitialPermalink";
import useMapContext from "../utils/hooks/useMapContext";

// @ts-expect-error bad type definition
import olStyle from "ol/ol.css";

import type { JSX, PreactDOMAttributes } from "preact";

import type { MobilityMapProps } from "../MobilityMap/MobilityMap";

export type RealtimeMapProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Map({ children, ...props }: RealtimeMapProps) {
  const mapRef = useRef();
  const { center, extent, map, maxextent, maxzoom, minzoom, setMap, zoom } =
    useMapContext();

  const propsFromPermalinkRef = useRef<null | Partial<MobilityMapProps>>(
    useInitialPermalink(),
  );

  const view = useMemo(() => {
    if (!maxextent) {
      return;
    }
    const bbox = maxextent.split(",").map((c) => {
      return parseFloat(c);
    });
    return new View({
      constrainOnlyCenter: true, // allow to have the same value as extent and max extent
      extent: bbox,
    });
  }, [maxextent]);

  useEffect(() => {
    if (!map || !view) {
      return;
    }
    const key = map.on("change:view", (evt) => {
      const oldView = evt.oldValue;
      if (oldView) {
        view.setMinZoom(oldView.getMinZoom());
        view.setMaxZoom(oldView.getMaxZoom());
        view.setCenter(oldView.getCenter());
        view.setZoom(oldView.getZoom());
      }
    });
    map.setView(view);

    return () => {
      unByKey(key);
    };
  }, [map, view]);

  useEffect(() => {
    let newMap: OlMap;
    if (mapRef.current) {
      newMap = new OlMap({
        controls: [],
        target: mapRef.current,
      });
      setMap(newMap);
    }

    return () => {
      newMap?.setTarget(undefined);
      setMap();
    };
  }, [setMap]);

  useEffect(() => {
    if (!map || !extent) {
      return;
    }
    const bbox = extent.split(",").map((c) => {
      return parseFloat(c);
    });
    if (bbox) {
      map.getView().fit(bbox);
    }
  }, [map, extent]);

  useEffect(() => {
    if (!map || !center) {
      return;
    }
    const [x, y] = center.split(",").map((c) => {
      return parseFloat(c);
    });
    if (x && y) {
      map.getView().setCenter([x, y]);
    }
  }, [map, center]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const number = parseFloat(zoom);
    if (number) {
      map.getView().setZoom(number);
    }
  }, [map, zoom]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const number = parseFloat(maxzoom);
    if (number) {
      map.getView().setMaxZoom(number);
    }
  }, [map, maxzoom]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const number = parseFloat(minzoom);
    if (number) {
      map.getView().setMinZoom(number);
    }
  }, [map, minzoom]);

  // Apply permalink parameters when the view is set after that the default attribute is set
  // Order of useEffect is important here.
  // This use effect should be called only when the view is set
  useEffect(() => {
    const curr = propsFromPermalinkRef.current;
    const mapView = map?.getView();
    if (mapView && curr.center) {
      mapView.setCenter(
        curr.center.split(",").map((c) => {
          return parseFloat(c);
        }),
      );
    }

    if (mapView && curr.zoom) {
      mapView.setZoom(parseFloat(curr.zoom));
    }
  }, [map]);

  return (
    <>
      <style>{olStyle}</style>
      <div ref={mapRef} {...props}>
        {children}
      </div>
    </>
  );
}

export default memo(Map);
