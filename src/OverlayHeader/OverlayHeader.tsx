import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import Cancel from "../icons/Cancel";
import IconButton from "../ui/IconButton";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type OverlayHeaderProps = {
  onClose?: () => void;
  title?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function OverlayHeader({
  children,
  className,
  onClose,
  title,
  ...props
}: OverlayHeaderProps) {
  return (
    <div
      {...props}
      className={twMerge(
        `flex flex-row items-center justify-between gap-2 border-b p-2 pl-4`,
        className as string,
      )}
    >
      {/* We set text-base so the clamp works on overlay container, not main */}
      {children || <span className={"text-base font-bold"}>{title}</span>}
      {onClose && (
        <IconButton
          className={"!size-[32px] border-none shadow-none"}
          onClick={onClose}
        >
          <Cancel />
        </IconButton>
      )}
    </div>
  );
}

export default memo(OverlayHeader);
