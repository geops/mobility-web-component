import { forwardRef } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type { InputHTMLAttributes, PreactDOMAttributes } from "preact";

export type InputProps = {
  className?: string;
  focusOnFirstRender?: boolean;
} & InputHTMLAttributes &
  PreactDOMAttributes;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={twMerge("p-2 text-sm read-only:text-gray-400", className)}
      />
    );
  },
);

export default Input;
