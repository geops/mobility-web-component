import { Map } from "ol";
import ScaleLineControl, {
  Options as ScaleLineOptions,
} from "ol/control/ScaleLine";
import { PreactDOMAttributes, JSX } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
// @ts-ignore
import style from "./index.css";

type ScaleLineProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & { map: Map; options?: ScaleLineOptions };

function ScaleLine({ map, options, ...props }: ScaleLineProps) {
  const [target, setTarget] = useState<HTMLElement>();
  const control = useMemo(() => {
    if (!target) {
      return null;
    }
    return new ScaleLineControl({ target, ...options });
  }, [options, target]);

  useEffect(() => {
    let keys = [];
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
