import ArrowDown from "../../icons/ArrowDown";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type RvfSelectProps = {
  className?: string;
} & HTMLAttributes<HTMLSelectElement> &
  PreactDOMAttributes;

function Select({ children, className, onChange }: RvfSelectProps) {
  return (
    <div className="text-grey relative flex items-center">
      <select
        className={`h-[32px] cursor-pointer appearance-none rounded-[12px] border border-current bg-white px-[13px] text-[16px] leading-[22px] disabled:cursor-default @sm/main:h-[36px] @md/main:h-[40px] ${className}`}
        onChange={onChange}
      >
        {children}
      </select>
      <ArrowDown className="pointer-events-none absolute right-[8px]" />
    </div>
  );
}

export default Select;
