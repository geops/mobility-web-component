import { memo, useMemo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  PreactDOMAttributes,
} from "preact";

export type ButtonProps = {
  className?: string;
  selected?: boolean;
  theme?: "primary" | "secondary";
} & AnchorHTMLAttributes &
  ButtonHTMLAttributes &
  PreactDOMAttributes;

const baseClasses =
  "flex gap-2 items-center px-4 py-2 rounded-2xl border hover:border-black hover:not-disabled:cursor-pointer";

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

function Button({
  children,
  className,
  href,
  selected = false,
  theme = "secondary",
  ...props
}: ButtonProps) {
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

export default memo(Button);
