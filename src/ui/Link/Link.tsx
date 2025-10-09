import { memo, useMemo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import ArrowUpRight from "../../icons/ArrowUpRight";

import type { AnchorHTMLAttributes, PreactDOMAttributes } from "preact";

export type LinkProps = {
  className?: string;
  theme?: "primary" | "secondary";
} & AnchorHTMLAttributes<HTMLAnchorElement> &
  PreactDOMAttributes;

const baseClasses =
  "my-1 flex items-center leading-[1.1] underline text-[14px] @sm/main:text-[16px] @md/main:text-[18px] items-center justify-left font-semibold";

export const themes = {
  primary: {
    classes:
      "bg-red text-white disabled:bg-lightgrey  hover:bg-darkred hover:border-darkred  active:bg-lightred active:border-lightred ",
    selectedClasses: "bg-darkred border-darkred",
  },
  secondary: {
    classes: "bg-white text-black hover:text-red active:text-lightred",
    selectedClasses: "text-red",
  },
};

function Link({
  children,
  className,
  theme = "secondary",
  ...props
}: LinkProps) {
  const classes = useMemo(() => {
    return twMerge(
      `${baseClasses} ${themes[theme].classes}  ${className || ""}`,
    );
  }, [className, theme]);

  return (
    <a className={classes} rel="noreferrer" target="_blank" {...props}>
      {children}
      <ArrowUpRight />
    </a>
  );
}

export default memo(Link);
