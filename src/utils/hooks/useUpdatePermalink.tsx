import { Map } from "ol";
import { unByKey } from "ol/Observable";
import { useEffect, useState } from "preact/hooks";

const useUpdatePermalink = (map: Map, permalink: boolean) => {
  const [x, setX] = useState<string>(null);
  const [y, setY] = useState<string>(null);
  const [z, setZ] = useState<string>(null);

  useEffect(() => {
    let listener;
    if (map && permalink) {
      listener = map.on("moveend", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newX = map.getView().getCenter()[0].toFixed(2);
        const newY = map.getView().getCenter()[1].toFixed(2);
        const newZ = map.getView().getZoom().toFixed(1);
        setX(newX);
        urlParams.set("x", newX);
        setY(newY);
        urlParams.set("y", newY);
        setZ(newZ);
        urlParams.set("z", newZ);
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
      });
    }
    return () => {
      unByKey(listener);
    };
  }, [map, permalink]);
  return { x, y, z };
};
export default useUpdatePermalink;
