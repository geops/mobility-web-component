import debounce from "lodash.debounce";
import { getLayersAsFlatArray } from "mobility-toolbox-js/common";
import { unByKey } from "ol/Observable";
import { useEffect } from "preact/hooks";

// import { LAYER_PROP_IS_EXPORTING } from "../constants";
// import getLayersAsFlatArray from "../getLayersAsFlatArray";
import getPermalinkParameters from "../getPermalinkParameters";
import MobilityEvent from "../MobilityEvent";

import type { Map } from "ol";
import type { EventsKey } from "ol/events";
import type { MutableRef } from "preact/hooks";

const updatePermalink = (
  map: Map,
  eventNodeRef: MutableRef<HTMLDivElement>,
) => {
  // No update when exporting
  // if (map.get(LAYER_PROP_IS_EXPORTING)) {
  //   return;
  // }
  const currentUrlParams = new URLSearchParams(window.location.search);
  const urlParams = getPermalinkParameters(map, currentUrlParams);
  urlParams.set("permalink", "true");
  window.history.replaceState(null, null, `?${urlParams.toString()}`);
  eventNodeRef?.current?.dispatchEvent(
    new MobilityEvent<string>("mwc:permalink", window.location.href),
  );
};

const updatePermalinkDebounced = debounce(updatePermalink, 1000);

/**
 * This hook only update parameters in the url, it does not apply the url parameters.
 */
const useUpdatePermalink = (
  map: Map,
  permalink: boolean,
  eventNodeRef: MutableRef<HTMLDivElement>,
) => {
  useEffect(() => {
    let moveEndKey: EventsKey;
    let loadEndKey: EventsKey;
    let changeVisibleKeys: EventsKey[];

    if (map && permalink) {
      updatePermalinkDebounced(map);

      // Update x,y,z in URL on moveend
      moveEndKey = map?.on("moveend", (evt) => {
        updatePermalinkDebounced(evt.map, eventNodeRef);
      });

      // Update layers in URL on change:visible event
      loadEndKey = map.once("loadend", (evt) => {
        updatePermalinkDebounced(evt.map, eventNodeRef);
        changeVisibleKeys = getLayersAsFlatArray(
          evt.map.getLayers().getArray(),
        ).map((layer) => {
          return layer.on("change:visible", () => {
            updatePermalinkDebounced(evt.map, eventNodeRef);
          });
        });
      });
    }

    return () => {
      unByKey(moveEndKey);
      unByKey(loadEndKey);
      unByKey(changeVisibleKeys);
    };
  }, [map, permalink, eventNodeRef]);
  return null;
};

export default useUpdatePermalink;
