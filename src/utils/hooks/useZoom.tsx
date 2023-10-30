import { useEffect, useState } from "preact/hooks";
import useMapContext from "./useMapContext";
import { unByKey } from "ol/Observable";

const useZoom = () => {
  const { map } = useMapContext();
  const [zoom, setZoom] = useState(map?.getView()?.getZoom());
  useEffect(() => {
    if (!map) {
      return;
    }
    let timeout;
    const view = map.getView();
    const zoomListener = view.on("change:resolution", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setZoom(view.getZoom()), 150);
    });
    return () => {
      clearTimeout(timeout);
      unByKey(zoomListener);
    };
  }),
    [map];
  return zoom;
};

export default useZoom;
