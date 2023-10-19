import { PreactDOMAttributes } from "preact";
import { useEffect, useState } from "preact/hooks";

export type ScrollableHandlerProps = PreactDOMAttributes &
  preact.JSX.HTMLAttributes;

function ScrollableHandler(props: ScrollableHandlerProps) {
  const [elt, setElt] = useState<HTMLElement>();
  const [overlayElt, setOverlayElt] = useState<HTMLElement>();

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
        const innerElt = overlayElt.querySelector(
          ".scrollable-inner",
        ) as HTMLDivElement;
        elt.setPointerCapture(evt.pointerId);

        const mapRect = overlayElt.parentElement.getBoundingClientRect();
        const eltRect = elt.getBoundingClientRect();
        const deltaToTop = mapRect.top + (evt.clientY - eltRect.top);

        function onDragg(evt: PointerEvent) {
          overlayElt.style.height = `calc(100% - ${
            evt.clientY - deltaToTop
          }px)`;
          overlayElt.style.maxHeight = `100%`;
        }

        function onDragStop(evt: PointerEvent) {
          (evt.target as HTMLElement).releasePointerCapture(evt.pointerId);
          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
        }
        document.addEventListener("pointerup", onDragStop);
        document.addEventListener("pointermove", onDragg);
        document.addEventListener("pointercancel", (evt) => {
          console.log("pointercancel");
          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
          evt.stopPropagation();
          evt.preventDefault();
        });
      }}
    >
      {props.children}
    </div>
  );
}

export default ScrollableHandler;
