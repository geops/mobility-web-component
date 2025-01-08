import type { JSX, PreactDOMAttributes } from "preact";

import { memo, useMemo } from "preact/compat";

export type IconButtonProps = {
  selected?: boolean;
  theme?: "primary" | "secondary";
} & JSX.ButtonHTMLAttributes<HTMLButtonElement> &
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
  selected = false,
  theme = "secondary",
  ...props
}: IconButtonProps) {
  const classes = useMemo(() => {
    return `${baseClasses} ${themes[theme].classes}  ${selected ? themes[theme].selectedClasses : ""} ${className || ""}`;
  }, [className, selected, theme]);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default memo(IconButton);
