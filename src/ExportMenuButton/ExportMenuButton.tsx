import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Download from "../icons/Download";
import IconButton from "../ui/IconButton";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { IconButtonProps } from "../ui/IconButton/IconButton";

export type ExportMenuButtonProps = IconButtonProps;

function ExportMenuButton({ ...props }: ExportMenuButtonProps) {
  const { isExportMenuOpen, setIsExportMenuOpen } = useMapContext();
  const { t } = useI18n();

  const onClick = useCallback(() => {
    setIsExportMenuOpen(!isExportMenuOpen);
  }, [isExportMenuOpen, setIsExportMenuOpen]);

  return (
    <IconButton
      title={t("print_menu_title")}
      {...props}
      onClick={onClick}
      selected={isExportMenuOpen}
    >
      <Download />
    </IconButton>
  );
}

export default memo(ExportMenuButton);
