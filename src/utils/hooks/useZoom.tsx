import { useEffect, useState } from "preact/hooks";
import { unByKey } from "ol/Observable";
import useMapContext from "./useMapContext";

const useZoom = () => {
  const { map } = useMapContext();
  const [zoom, setZoom] = useState(map?.getView()?.getZoom());
  useEffect(() => {
    if (!map) {
      return;
    }
    let timeout;
    const view = map.getView();
    if (view) {
      setZoom(view.getZoom());
    }
    const zoomListener = view.on("change:resolution", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setZoom(view.getZoom()), 150);
    });
    return () => {
      clearTimeout(timeout);
      unByKey(zoomListener);
    };
  }, [map]);
  return zoom;
};

export default useZoom;
