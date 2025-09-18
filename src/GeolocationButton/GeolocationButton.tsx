import { Geolocation } from "ol";
import { unByKey } from "ol/Observable";
import { fromLonLat } from "ol/proj";
import { memo } from "preact/compat";
import { useEffect, useMemo } from "preact/hooks";

import GeolocationIcon from "../icons/Geolocation";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

import type { JSX, PreactDOMAttributes } from "preact";

export type GeolocationButtonProps = JSX.HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

const TRACKING_ZOOM = 16;

function GeolocationButton({ ...props }: GeolocationButtonProps) {
  const mapContext = useMapContext();
  const { isTracking, map, setIsTracking } = mapContext;

  const geolocation = useMemo(() => {
    return new Geolocation();
  }, []);

  useEffect(() => {
    let keys = [];
    if (!map || !geolocation) {
      return;
    }
    keys = [
      // First time we zoom and center on the position
      geolocation.once("change:position", (evt) => {
        const position = evt.target.getPosition();
        if (evt.target.getPosition()) {
          map.getView().setZoom(TRACKING_ZOOM);
          map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
        }
      }),
      // then we only center the map.
      geolocation.on("change:position", (evt) => {
        const position = evt.target.getPosition();
        if (evt.target.getPosition()) {
          map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
        }
      }),
    ];

    return () => {
      unByKey(keys);
    };
  }, [map, geolocation]);

  useEffect(() => {
    geolocation.setTracking(isTracking);
  }, [geolocation, isTracking]);

  return (
    <IconButton
      onClick={() => {
        setIsTracking(!isTracking);
      }}
      {...props}
    >
      <GeolocationIcon className={isTracking ? "animate-pulse" : ""} />
    </IconButton>
  );
}

export default memo(GeolocationButton);
