import { useEffect, useState } from "preact/hooks";

function ScrollableHandler(props) {
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
          setOverlayElt(node.parentElement);
        }
      }}
      {...props}
      onPointerDown={(evt) => {
        const elt = evt.target as HTMLElement;

        if (!elt) {
          return;
        }
        setOverlayElt(overlayElt);

        elt.setPointerCapture(evt.pointerId);

        overlayElt.style.transitionDuration = "0s";

        const deltaToTop =
          overlayElt.parentElement.getBoundingClientRect().top +
          elt.offsetTop +
          evt.offsetY;

        function onDragg(evt: PointerEvent) {
          overlayElt.style.height = `calc(100% - ${evt.y - deltaToTop}px)`;
          overlayElt.style.maxHeight = `100%`;
          evt.stopPropagation();
          evt.preventDefault();
        }

        function onDragStop(evt: PointerEvent) {
          overlayElt.style.transitionDuration = ".5s";

          (evt.target as HTMLElement).releasePointerCapture(evt.pointerId);

          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
          evt.stopPropagation();
          evt.preventDefault();
        }
        document.addEventListener("pointerup", onDragStop);
        document.addEventListener("pointermove", onDragg);
        document.addEventListener("pointercancel", (evt) => {
          document.removeEventListener("pointermove", onDragg);
          document.removeEventListener("pointerup", onDragStop);
          evt.stopPropagation();
          evt.preventDefault();
        });
        evt.stopPropagation();
        evt.preventDefault();
      }}
    ></div>
  );
}

export default ScrollableHandler;
