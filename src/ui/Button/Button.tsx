import type { JSX, PreactDOMAttributes } from "preact";

import { memo, useMemo } from "preact/compat";

export type ButtonProps = {
  selected?: boolean;
  theme?: "primary" | "secondary";
} & JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

const baseClasses = "flex";

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
  selected = false,
  theme = "secondary",
  ...props
}: ButtonProps) {
  const classes = useMemo(() => {
    return `${baseClasses} ${themes[theme].classes}  ${selected ? themes[theme].selectedClasses : ""} ${className || ""}`;
  }, [className, selected, theme]);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default memo(Button);
