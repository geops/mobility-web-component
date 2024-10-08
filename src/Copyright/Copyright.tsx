import { ControlCommonOptions } from "mobility-toolbox-js/common/controls/ControlCommon";
import { CopyrightControl } from "mobility-toolbox-js/ol";
import { JSX, PreactDOMAttributes } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";
// @ts-expect-error bad type definition
import style from "./index.css";

export type CopyrightProps = {
  options?: ControlCommonOptions;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Copyright({ options, ...props }: CopyrightProps) {
  const { map } = useMapContext();
  const [target, setTarget] = useState<HTMLElement>();
  const control = useMemo(() => {
    if (!target) {
      return null;
    }
    const div = document.createElement("div");
    // @ts-expect-error bad type definition
    div.className = "flex flex-wrap-reverse justify-end";

    return new CopyrightControl({
      element: div,
      target,
      ...options,
    });
  }, [options, target]);

  useEffect(() => {
    if (!map || !control) {
      return;
    }
    control.attachToMap(map);

    return () => {
      if (control) {
        control.detachFromMap();
      }
    };
  }, [map, control]);

  return (
    <div
      ref={(node) => {
        setTarget(node);
      }}
      {...props}
    >
      <style>{style}</style>
    </div>
  );
}

export default Copyright;
