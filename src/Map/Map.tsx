import { Map as OlMap, View } from "ol";
import { unByKey } from "ol/Observable";
// @ts-expect-error bad type definition
import olStyle from "ol/ol.css";
import { JSX, PreactDOMAttributes } from "preact";
import { memo } from "preact/compat";
import { useEffect, useMemo, useRef } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

export type RealtimeMapProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Map({ children, ...props }: RealtimeMapProps) {
  const mapRef = useRef();
  const { center, extent, map, maxextent, maxzoom, minzoom, setMap, zoom } =
    useMapContext();

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
      newMap?.setTarget();
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
