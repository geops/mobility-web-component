import { forwardRef, memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type { PreactDOMAttributes } from "preact";
import type { MutableRef } from "preact/hooks";

function ShadowOverflow(
  {
    children,
    className,
    ...props
  }: { className?: string } & PreactDOMAttributes,
  ref: MutableRef<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={twMerge("relative overflow-y-auto", className)}
      ref={ref}
    >
      <div className="pointer-events-none sticky top-0 right-0 left-0 h-4 bg-gradient-to-t from-transparent to-white"></div>
      {children}
      <div className="pointer-events-none sticky right-0 bottom-[-1px] left-0 h-4 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}

export default memo(forwardRef(ShadowOverflow));
