import ScaleLineControl from "ol/control/ScaleLine";
import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

// @ts-expect-error bad type definition
import style from "./index.css";

import type { Options as ScaleLineOptions } from "ol/control/ScaleLine";
import type { JSX, PreactDOMAttributes } from "preact";

type ScaleLineProps = {
  options?: ScaleLineOptions;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function ScaleLine({ options, ...props }: ScaleLineProps) {
  const { map } = useMapContext();
  const [target, setTarget] = useState<HTMLElement>();
  const control = useMemo(() => {
    if (!target) {
      return null;
    }
    return new ScaleLineControl({ target, ...options });
  }, [options, target]);

  useEffect(() => {
    if (!map || !control) {
      return;
    }
    map.addControl(control);

    return () => {
      if (map && control) {
        map.removeControl(control);
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

export default ScaleLine;
