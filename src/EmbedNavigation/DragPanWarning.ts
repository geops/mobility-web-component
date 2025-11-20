import { Control } from "ol/control";
import { DragPan } from "ol/interaction";
import { unByKey } from "ol/Observable";

import type { Map, MapBrowserEvent } from "ol";
import type { Options } from "ol/control/Control";
import type { EventsKey } from "ol/events";

export type DragPanWarningOptions = {
  className?: string;
  element?: HTMLElement;
} & Options;

class DragPanWarning extends Control {
  dragPan?: DragPan;

  icon: HTMLDivElement;

  onPointerDragRef?: EventsKey;

  text: HTMLParagraphElement;

  constructor(options: DragPanWarningOptions = {}) {
    let element = options.element;

    if (!element) {
      element = document.createElement("div");
      element.className =
        options.className !== undefined
          ? options.className
          : "ol-drag-pan-warning";
    }

    element.style.display = "none";
    element.style.pointerEvents = "auto";

    super({
      element,
      render: options.render,
      target: options.target,
    });

    if (!options.element) {
      this.icon = document.createElement("div");
      this.icon.className = `${element.className}-icon`;

      // sbb icons: sbb/two-finger-tap-large.svg';
      this.icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="none" stroke="currentColor" stroke-width="2" d="M22.999,25 L22.997,13.002 C22.997,11.896 23.893,11 24.999,11 C26.105,11 27.001,11.896 27.001,13.002 L26.999,26.002 M31,25.003 C31,23.897 31.896,23.001 33.002,23.001 C34.11,23.001 35.006,23.897 35.006,25.003 C35.006,25.003 35,26.125 35,32.001 C35,37.875 33.2,41.001 33.2,41.001 L19,41.001 C19,41.001 12.21,29.483 11.586,28.419 C10.962,27.355 10.804,26.369 11.586,25.587 C12.37,24.805 13.636,24.805 14.418,25.587 L18.998,30.169 L19,30.169 L19,25.001 L18.996,15.003 C18.996,13.897 19.894,13.001 21,13.001 C22.106,13.001 23.002,13.897 23.002,15.003 L23,26.015 M26.9942,22.997 C26.9942,21.891 27.8902,20.995 28.9962,20.995 C30.1042,20.995 31.0002,21.891 31.0002,22.997 L31.0002,26.001 M30,16.3046 C30.632,15.3606 31,14.2246 31,13.0006 C31,9.6846 28.314,7.0006 25,7.0006 C23.208,7.0006 21.616,7.8026 20.518,9.0486 C17.432,9.2986 15,11.8506 15,15.0006 C15,16.2166 15.368,17.3426 15.988,18.2866"/>
      </svg>
    `;
      this.element.appendChild(this.icon);

      this.text = document.createElement("p");
      this.text.className = `${element.className}-text`;
      this.text.innerHTML = "Benutzen Sie 2 Finger um die Karte zu bedienen.";
      this.element.appendChild(this.text);
    }

    this.dragPan = undefined;
    this.onPointerDragRef = undefined;
    this.onPointerDrag = this.onPointerDrag.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }

  onPointerDrag(event: MapBrowserEvent<PointerEvent>) {
    // Show the warning on next pointerdrag events.
    if (event.activePointers?.length !== 1) {
      return true;
    }
    this.element.style.display = "flex";
    document.addEventListener("touchend", this.onTouchEnd, { once: true });
    return false;
  }

  onTouchEnd() {
    unByKey(this.onPointerDragRef);
    this.element.style.display = "none";
  }

  setMap(map: Map) {
    super.setMap(map);
    document.removeEventListener("touchend", this.onTouchEnd);
    unByKey(this.onPointerDragRef);

    if (map) {
      const viewport = map.getViewport();

      // We allow default scroll behavior for touch events.
      viewport.style.touchAction = "pan-x pan-y";

      // Deactivate drag pan only on touch events.
      this.dragPan = map
        .getInteractions()
        .getArray()
        .find((interaction) => {
          return interaction instanceof DragPan;
        });

      if (!this.dragPan) {
        // eslint-disable-next-line no-console
        console.error(
          "Impossible to find the DragPan interaction, DragPanWarning will not work as expected.",
        );
        return;
      }

      this.listenerKeys.push(
        // @ts-expect-error - we need to listen to pointerdown events
        map.on("pointerdown", (evt: MapBrowserEvent<PointerEvent>) => {
          document.removeEventListener("touchend", this.onTouchEnd);

          if (
            evt.originalEvent.pointerType !== "touch" ||
            // @ts-expect-error - condition_ is a private method
            !this.dragPan?.condition_(evt)
          ) {
            this.element.style.display = "none";
            return true;
          }

          this.onPointerDragRef = map.on("pointerdrag", this.onPointerDrag);

          return true;
        }),
      );
      this.element.addEventListener("click", this.onTouchEnd);
    }
  }
}

export default DragPanWarning;
