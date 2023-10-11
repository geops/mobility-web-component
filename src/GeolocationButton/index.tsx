import { Geolocation, Map } from "ol";
import { unByKey } from "ol/Observable";
import { fromLonLat } from "ol/proj";
import { PreactDOMAttributes } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

type Props = { map: Map } & PreactDOMAttributes;

function GeolocationButton({ map, ...props }: Props) {
  const [isTracking, setIsTracking] = useState(false);

  const geolocation = useMemo(() => {
    return new Geolocation();
  }, []);

  useEffect(() => {
    let keys = [];
    if (!map || !geolocation) {
      return;
    }
    keys = [
      geolocation.on("change:position", () => {
        const position = geolocation.getPosition();
        if (position) {
          map.getView().setCenter(fromLonLat(position, "EPSG:3857"));
        }
      }),
      geolocation.on("change:tracking", () => {
        const position = geolocation.getPosition();
        const tracking = geolocation.getTracking();
        if (position && tracking) {
          map.getView().setZoom(16);
        }
      }),
    ];

    return () => {
      unByKey(keys);
    };
  }, [map, geolocation]);

  return (
    <button
      className="bg-white shadow-lg rounded-full p-1"
      onClick={() => {
        setIsTracking(!isTracking);
        geolocation.setTracking(!isTracking);
      }}
      {...props}
    >
      <svg
        className={isTracking ? "animate-pulse" : ""}
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        focusable="false"
        height="1.5em"
        width="1.5em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z"></path>
      </svg>
    </button>
  );
}

export default GeolocationButton;
