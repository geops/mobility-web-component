import { memo, useMemo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PreactDOMAttributes,
} from "preact";

export type IconButtonProps = {
  className?: string;
  selected?: boolean;
  theme?: "primary" | "secondary";
} & AnchorHTMLAttributes &
  ButtonHTMLAttributes &
  PreactDOMAttributes;

const baseClasses =
  "flex size-9 items-center justify-center rounded-full bg-white p-1.5 shadow-lg";

export const themes = {
  primary: {
    classes: "",
    selectedClasses: "",
  },
  secondary: {
    classes: "",
    selectedClasses: "",
  },
};

function IconButton({
  children,
  className,
  href,
  selected = false,
  theme = "secondary",
  ...props
}: IconButtonProps) {
  const classes = useMemo(() => {
    return twMerge(
      baseClasses,
      themes[theme].classes,
      selected ? themes[theme].selectedClasses : "",
      className,
    );
  }, [className, selected, theme]);

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default memo(IconButton);
