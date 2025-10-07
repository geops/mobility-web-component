import { twMerge } from "tailwind-merge";

import type { InputHTMLAttributes, PreactDOMAttributes } from "preact";

export type InputProps = { className?: string } & InputHTMLAttributes &
  PreactDOMAttributes;

function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={twMerge("p-2 text-sm read-only:text-gray-400", className)}
    />
  );
}

export default Input;
