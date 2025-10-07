import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Share from "../icons/Share";
import IconButton from "../ui/IconButton";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type ShareMenuButtonProps = HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function ShareMenuButton({ ...props }: ShareMenuButtonProps) {
  const { isShareMenuOpen, setIsShareMenuOpen } = useMapContext();
  const { t } = useI18n();

  const onClick = useCallback(() => {
    setIsShareMenuOpen(!isShareMenuOpen);
  }, [isShareMenuOpen, setIsShareMenuOpen]);

  return (
    <IconButton
      title={t("share_menu_title")}
      {...props}
      onClick={onClick}
      selected={isShareMenuOpen}
    >
      <Share />
    </IconButton>
  );
}

export default memo(ShareMenuButton);
