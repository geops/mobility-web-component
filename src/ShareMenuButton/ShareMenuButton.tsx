import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Share from "../icons/Share";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type RvfShareMenuButtonProps = HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function ShareMenuButton({ ...props }: RvfShareMenuButtonProps) {
  const { isShareMenuOpen, setIsShareMenuOpen } = useMapContext();

  const onClick = useCallback(() => {
    setIsShareMenuOpen(!isShareMenuOpen);
  }, [isShareMenuOpen, setIsShareMenuOpen]);

  return (
    <IconButton {...props} onClick={onClick} selected={isShareMenuOpen}>
      <Share />
    </IconButton>
  );
}

export default memo(ShareMenuButton);
