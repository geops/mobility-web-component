import ScaleLineControl, {
  Options as ScaleLineOptions,
} from "ol/control/ScaleLine";
import { PreactDOMAttributes, JSX } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
// @ts-ignore
import style from "./index.css";
import useMapContext from "../utils/hooks/useMapContext";

type ScaleLineProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement> & { options?: ScaleLineOptions };

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
      return () => {};
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
