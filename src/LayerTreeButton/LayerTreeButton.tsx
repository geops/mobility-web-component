import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Stack from "../icons/Stack";
import IconButton from "../ui/IconButton";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { IconButtonProps } from "../ui/IconButton/IconButton";

export type LayerTreeButtonProps = IconButtonProps;

function LayerTreeButton({ ...props }: LayerTreeButtonProps) {
  const { isLayerTreeOpen, setIsLayerTreeOpen } = useMapContext();
  const { t } = useI18n();

  const onClick = useCallback(() => {
    setIsLayerTreeOpen(!isLayerTreeOpen);
  }, [isLayerTreeOpen, setIsLayerTreeOpen]);

  return (
    <IconButton
      title={t("layertree_menu_title")}
      {...props}
      onClick={onClick}
      selected={isLayerTreeOpen}
    >
      <Stack />
    </IconButton>
  );
}

export default memo(LayerTreeButton);
