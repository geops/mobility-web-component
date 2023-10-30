import { Map as OlMap } from "ol";
import { useEffect, useRef } from "preact/hooks";
import useMapContext from "../utils/hooks/useMapContext";
import { memo } from "preact/compat";
import type { MobilityMapProps } from "../MobilityMap";
import { PreactDOMAttributes, JSX } from "preact";

// @ts-ignore
import olStyle from "ol/ol.css";

export type RealtimeMapProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> &
  MobilityMapProps;

const TRACKING_ZOOM = 16;

function Map({
  apikey,
  baselayer = "travic_v2",
  center = "831634,5933959",
  zoom = "13",
  minzoom,
  maxzoom,
  mots,
  tenant,
  children,
  ...props
}: RealtimeMapProps) {
  const mapRef = useRef();
  const { map, setMap } = useMapContext();

  useEffect(() => {
    if (mapRef.current) {
      const newMap = new OlMap({ target: mapRef.current, controls: [] });
      setMap(newMap);
    }

    return () => {
      map.setTarget();
      setMap();
    };
  }, []);

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
