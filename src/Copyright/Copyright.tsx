import { JSX, PreactDOMAttributes } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { CopyrightControl } from "mobility-toolbox-js/ol";
import { ControlCommonOptions } from "mobility-toolbox-js/common/controls/ControlCommon";
import useMapContext from "../utils/hooks/useMapContext";

// @ts-expect-error bad type definition
import style from "./index.css";

export type CopyrightProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    options?: ControlCommonOptions;
  };

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
      target,
      element: div,
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
