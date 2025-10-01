import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import type { PreactDOMAttributes } from "preact";

function ShadowOverflow({
  children,
  className,
  ...props
}: { className?: string } & PreactDOMAttributes) {
  return (
    <div {...props} className={twMerge("relative overflow-y-auto", className)}>
      <div className="pointer-events-none sticky top-0 right-0 left-0 h-4 bg-gradient-to-t from-transparent to-white"></div>
      {children}
      <div className="pointer-events-none sticky right-0 bottom-[-1px] left-0 h-4 bg-gradient-to-b from-transparent to-white"></div>
    </div>
  );
}

export default memo(ShadowOverflow);
