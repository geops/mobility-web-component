import { twMerge } from "tailwind-merge";

import ScrollableHandler from "../ScrollableHandler";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { ScrollableHandlerProps } from "../ScrollableHandler";

export type OverlayProps = {
  className;
  ScrollableHandlerProps?: ScrollableHandlerProps;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Overlay({
  children,
  className,
  ScrollableHandlerProps = {},
}: OverlayProps) {
  let hasChildren = !!children;
  if (Array.isArray(children)) {
    hasChildren =
      children?.length &&
      (children || []).find((c) => {
        return !!c;
      });
  }

  if (!hasChildren) {
    return null;
  }

  return (
    <div
      className={
        (twMerge(
          `pointer-events-auto relative z-50 flex flex-col overflow-hidden bg-white transition-[min-height,max-height] @lg:transition-[width]`,
        ),
        className)
      }
    >
      {hasChildren && (
        <>
          <ScrollableHandler
            className="absolute inset-0 flex h-[65px] touch-none justify-center @lg/main:hidden"
            style={{ width: "100%" }}
            {...ScrollableHandlerProps}
          >
            <div
              className="m-2 mr-[-60px] bg-gray-300"
              style={{
                borderRadius: 2,
                height: 4,
                width: 32,
              }}
            />
          </ScrollableHandler>
          {children}
        </>
      )}
    </div>
  );
}

export default Overlay;
