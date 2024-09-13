import { JSX, PreactDOMAttributes } from "preact";
import { useEffect, useState } from "preact/hooks";

export type ScrollableHandlerProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function ScrollableHandler(props: ScrollableHandlerProps) {
  const [elt, setElt] = useState<HTMLElement>();
  const [overlayElt, setOverlayElt] = useState<HTMLElement>();
  const { children } = props;

  useEffect(() => {
    // Clean css added by the scroller
    return () => {
      if (overlayElt) {
        overlayElt.style.height = "";
        overlayElt.style.maxHeight = "";
      }
    };
  }, [overlayElt]);

  return (
    <div
      ref={(node) => {
        if (node) {
          setElt(node);
          setOverlayElt(node.parentElement);
        }
      }}
      {...props}
      onPointerDown={(evt) => {
        elt.setPointerCapture(evt.pointerId);

        const mapRect = overlayElt.parentElement.getBoundingClientRect();
        const eltRect = elt.getBoundingClientRect();
        const deltaToTop = mapRect.top + (evt.clientY - eltRect.top);

        function onDragg(event: PointerEvent) {
          overlayElt.style.height = `calc(100% - ${
            event.clientY - deltaToTop
          }px)`;
          overlayElt.style.maxHeight = `100%`;
        }

        function onDragStop(event: PointerEvent) {
          (event.target as HTMLElement).releasePointerCapture(evt.pointerId);
          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
        }
        document.addEventListener("pointerup", onDragStop);
        document.addEventListener("pointermove", onDragg);
        document.addEventListener("pointercancel", (event: PointerEvent) => {
          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
          event.stopPropagation();
          event.preventDefault();
        });
      }}
    >
      {children}
    </div>
  );
}

export default ScrollableHandler;
