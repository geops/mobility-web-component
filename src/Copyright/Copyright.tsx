import { CopyrightControl } from "mobility-toolbox-js/ol";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

// @ts-expect-error bad type definition
import style from "./index.css";

import type { CopyrightControlOptions } from "mobility-toolbox-js/ol/controls/CopyrightControl";
import type { JSX, PreactDOMAttributes } from "preact";

export type CopyrightProps = {
  options?: CopyrightControlOptions;
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
    map.addControl(control);
    return () => {
      map?.removeControl(control);
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
