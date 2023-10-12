import { useEffect, useState } from "preact/hooks";

function ScrollableHandler(props) {
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

        overlayElt.style.transitionDuration = "0s";

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
          overlayElt.style.transitionDuration = ".5s";
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
