import { Geolocation } from "ol";
import { unByKey } from "ol/Observable";
import { fromLonLat } from "ol/proj";
import { useEffect, useMemo } from "preact/hooks";
import type { PreactDOMAttributes, JSX } from "preact";
import useMapContext from "../utils/hooks/useMapContext";

export type GeolocationButtonProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLButtonElement>;

const TRACKING_ZOOM = 16;

function GeolocationButton({ ...props }: GeolocationButtonProps) {
  const mapContext = useMapContext();
  const { map, isTracking, setIsTracking } = mapContext;

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
    <button
      type="button"
      className="bg-white shadow-lg rounded-full p-1"
      onClick={() => {
        setIsTracking(!isTracking);
      }}
      {...props}
    >
      <svg
        className={isTracking ? "animate-pulse" : ""}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        focusable="false"
        height="1.5em"
        width="1.5em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z" />
      </svg>
    </button>
  );
}

export default GeolocationButton;
