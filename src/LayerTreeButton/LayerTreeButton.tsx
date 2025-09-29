import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Stack from "../icons/Stack";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type LayerTreeButtonProps = HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function LayerTreeButton({ ...props }: LayerTreeButtonProps) {
  const { isLayerTreeOpen, setIsLayerTreeOpen } = useMapContext();

  const onClick = useCallback(() => {
    setIsLayerTreeOpen(!isLayerTreeOpen);
  }, [isLayerTreeOpen, setIsLayerTreeOpen]);

  return (
    <IconButton {...props} onClick={onClick} selected={isLayerTreeOpen}>
      <Stack />
    </IconButton>
  );
}

export default memo(LayerTreeButton);
