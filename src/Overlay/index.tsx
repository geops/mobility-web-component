import { PreactDOMAttributes } from "preact";
import ScrollableHandler, {
  ScrollableHandlerProps,
} from "../ScrollableHandler";

export type OverlayProps = PreactDOMAttributes &
  preact.JSX.HTMLAttributes & {
    ScrollableHandlerProps?: ScrollableHandlerProps;
  };

function Overlay({ children, ScrollableHandlerProps = {} }: OverlayProps) {
  return (
    <div
      className={`flex-0 relative overflow-hidden flex flex-col transition-[min-height,max-height] @lg:transition-[width]  ${
        children
          ? "w-full min-h-[75px] max-h-[70%] @lg:w-[350px] @lg:max-h-full @lg:h-[100%!important] border-t @lg:border-t-0 @lg:border-r"
          : "min-h-0 max-h-0 @lg:w-0"
      }`}
    >
      {!!children && (
        <>
          <ScrollableHandler
            className="z-10 absolute inset-0 h-[65px] touch-none @lg:hidden flex justify-center"
            style={{ width: "100%" }}
            {...ScrollableHandlerProps}
          >
            <div
              className="bg-gray-300 m-2 -mr-[60px]"
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
              }}
            ></div>
          </ScrollableHandler>
          {children}
        </>
      )}
    </div>
  );
}

export default Overlay;
