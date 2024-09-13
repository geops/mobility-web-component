import { Map as OlMap } from "ol";
// @ts-expect-error bad type definition
import olStyle from "ol/ol.css";
import { PreactDOMAttributes, JSX } from "preact";
import { memo } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

export type RealtimeMapProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

function Map({ children, ...props }: RealtimeMapProps) {
  const mapRef = useRef();
  const {
    center = "831634,5933959",
    zoom = "13",
    minzoom,
    maxzoom,
    map,
    setMap,
  } = useMapContext();

  useEffect(() => {
    let newMap: OlMap;
    if (mapRef.current) {
      newMap = new OlMap({ target: mapRef.current, controls: [] });
      setMap(newMap);
    }

    return () => {
      newMap?.setTarget();
      setMap();
    };
  }, [setMap]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const [x, y] = center.split(",").map((c) => parseFloat(c));
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
