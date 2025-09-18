import { MouseWheelZoom } from "ol/interaction";
import { useEffect, useState } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import DragPanWarning from "./DragPanWarning";

function EmbedNavigation() {
  const { isEmbed, map } = useMapContext();
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let dragPanWarningControl = null;

    if (!map || !target || !isEmbed) {
      return;
    }

    // Deactivates mouse wheel zoom
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof MouseWheelZoom) {
        interaction.setActive(false);
      }
    });

    dragPanWarningControl = new DragPanWarning({ target: target });
    map.addControl(dragPanWarningControl);

    return () => {
      if (dragPanWarningControl) {
        map.removeControl(dragPanWarningControl);
      }

      // Deactivates mouse wheel zoom
      map.getInteractions().forEach((interaction) => {
        if (interaction instanceof MouseWheelZoom) {
          interaction.setActive(true);
        }
      });
    };
  }, [map, target, isEmbed]);

  return (
    <div
      ref={(node) => {
        return setTarget(node);
      }}
    ></div>
  );
}

export default EmbedNavigation;
