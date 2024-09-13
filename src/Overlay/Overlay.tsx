import { JSX, PreactDOMAttributes } from "preact";

import type { ScrollableHandlerProps } from "../ScrollableHandler";

import ScrollableHandler from "../ScrollableHandler";

export type OverlayProps = {
  ScrollableHandlerProps?: ScrollableHandlerProps;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function Overlay({ children, ScrollableHandlerProps = {} }: OverlayProps) {
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
      className={`relative flex flex-col overflow-hidden transition-[min-height,max-height] @lg:transition-[width]  ${
        children
          ? "max-h-[70%] min-h-[75px] w-full border-t @lg:h-[100%!important] @lg:max-h-full @lg:w-[350px] @lg:border-r @lg:border-t-0"
          : "max-h-0 min-h-0 @lg:w-0"
      }`}
    >
      {hasChildren && (
        <>
          <ScrollableHandler
            className="absolute inset-0 z-10 flex h-[65px] touch-none justify-center @lg:hidden"
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
