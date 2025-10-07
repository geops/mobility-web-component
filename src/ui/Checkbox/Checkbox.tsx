import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import ok from "../../icons/Ok/ok-grey.svg";

import type { InputHTMLAttributes } from "preact";

export type RvfCheckboxProps = {
  checkedIconUrl?: string;
  className?: string;
} & InputHTMLAttributes;

function Checkbox({ className, ...props }: RvfCheckboxProps) {
  const checkedIconUrl = props.checkedIconUrl || ok;
  return (
    <input
      checked={props.checked}
      className={twMerge(
        `border-grey text-grey disabled:border-lightgrey box-border size-[20px] flex-none cursor-pointer appearance-none rounded border-2 bg-white bg-contain bg-center disabled:cursor-default`,
        className,
      )}
      style={{
        backgroundImage:
          props.checked && !props.disabled ? `url('${checkedIconUrl}')` : "",
      }}
      {...props}
      type="checkbox"
    />
  );
}

export default memo(Checkbox);
