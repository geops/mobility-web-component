import { useLayoutEffect } from "react";

import type { MutableRef } from "react";

const defaultScrollOptions: ScrollIntoViewOptions = { behavior: "smooth" };

function useScrollTo(
  ref: MutableRef<HTMLElement>,
  targetSelector: string,
  dependenciesArray: unknown[] = [],
  scrollToOptions: ScrollIntoViewOptions = defaultScrollOptions,
) {
  useLayoutEffect(() => {
    const elt = ref.current;
    if (!elt) {
      return;
    }
    const scrollToElt = elt.querySelector(targetSelector);

    if (scrollToElt) {
      try {
        // We use scrollTo avoid scrolling the entire window.
        elt.scrollTo({
          ...scrollToOptions,
          top: (scrollToElt as HTMLElement).offsetTop || 0,
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error while scrolling to element", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependenciesArray]);
}

export default useScrollTo;
