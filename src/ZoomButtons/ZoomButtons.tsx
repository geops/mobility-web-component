import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useCallback, useEffect, useState } from "preact/hooks";

import Minus from "../icons/Minus";
import Plus from "../icons/Plus";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

function ZoomButtons() {
  const { map } = useMapContext();
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false);
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false);

  const handleZoomIn = useCallback(() => {
    if (!map?.getView()) {
      return;
    }
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map?.getView()) {
      return;
    }
    const view = map.getView();
    const zoom = view.getZoom();
    view.setZoom(zoom - 1);
  }, [map]);

  useEffect(() => {
    const key = map?.on("moveend", () => {
      const view = map.getView();
      const zoom = view.getZoom();
      const maxzoom = view.getMaxZoom();
      const minzoom = view.getMinZoom();

      if (maxzoom && zoom === Number(maxzoom)) {
        setIsZoomInDisabled(true);
      } else {
        setIsZoomInDisabled(false);
      }

      if (minzoom && zoom === Number(minzoom)) {
        setIsZoomOutDisabled(true);
      } else {
        setIsZoomOutDisabled(false);
      }
    });
    return () => {
      unByKey(key);
    };
  }, [map]);

  return (
    <>
      <IconButton disabled={isZoomInDisabled} onClick={handleZoomIn}>
        <Plus />
      </IconButton>

      <IconButton disabled={isZoomOutDisabled} onClick={handleZoomOut}>
        <Minus />
      </IconButton>
    </>
  );
}

export default memo(ZoomButtons);
