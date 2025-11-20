import { MouseWheelZoom } from "ol/interaction";
import { useEffect, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import TouchFingers from "../icons/TouchFingers";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import DragPanWarning from "./DragPanWarning";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type EmbedNavigationProps = {
  elementClassName?: string;
  iconProps?: React.SVGProps<SVGSVGElement>;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function EmbedNavigation({
  children,
  elementClassName,
  iconProps,
}: EmbedNavigationProps) {
  const { t } = useI18n();
  const { isEmbed, map } = useMapContext();
  const [target, setTarget] = useState(null);
  const [element, setElement] = useState(null);

  useEffect(() => {
    let dragPanWarningControl = null;

    if (!map || !target || !isEmbed || !element) {
      return;
    }

    // Deactivates mouse wheel zoom
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof MouseWheelZoom) {
        interaction.setActive(false);
      }
    });

    dragPanWarningControl = new DragPanWarning({
      element: element,
      target: target,
    });
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
  }, [map, target, isEmbed, element]);
  return (
    <div
      ref={(node) => {
        return setTarget(node);
      }}
    >
      <div
        className={twMerge(
          "absolute inset-0 z-100000 flex flex-col items-center justify-center bg-black/60 p-6 font-bold text-white",
          elementClassName,
          "hidden",
        )}
        ref={(node) => {
          return setElement(node);
        }}
      >
        {children || (
          <>
            <TouchFingers height="48" width="48" {...iconProps}></TouchFingers>
            <p>{t("use_2_fingers")}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default EmbedNavigation;
