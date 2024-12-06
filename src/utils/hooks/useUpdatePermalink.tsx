import { Map } from "ol";
import { unByKey } from "ol/Observable";
import { useEffect } from "preact/hooks";

const useUpdatePermalink = (map: Map, permalink: boolean) => {
  useEffect(() => {
    let listener;
    if (map && permalink) {
      listener = map.on("moveend", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newX = map.getView().getCenter()[0].toFixed(2);
        const newY = map.getView().getCenter()[1].toFixed(2);
        const newZ = map.getView().getZoom().toFixed(1);
        urlParams.set("x", newX);
        urlParams.set("y", newY);
        urlParams.set("z", newZ);
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
      });
    }
    return () => {
      unByKey(listener);
    };
  }, [map, permalink]);
  return null;
};
export default useUpdatePermalink;
