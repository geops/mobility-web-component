import { Map } from "ol";
import { JSX, PreactDOMAttributes } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
// @ts-ignore
import style from "./index.css";
import { CopyrightControl } from "mobility-toolbox-js/ol";
import { ControlCommonOptions } from "mobility-toolbox-js/common/controls/ControlCommon";

export type CopyrightProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & {
    map: Map;
    options?: ControlCommonOptions;
  };

function Copyright({ map, options, ...props }: CopyrightProps) {
  const [target, setTarget] = useState<HTMLElement>();
  const control = useMemo(() => {
    if (!target) {
      return null;
    }
    const div = document.createElement("div");
    // @ts-ignore
    div.className = "flex flex-wrap-reverse justify-end";

    return new CopyrightControl({
      target: target,
      element: div,
      ...options,
    });
  }, [options, target]);

  useEffect(() => {
    let keys = [];
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
