import debounce from "lodash.debounce";
import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { memo } from "preact/compat";
import { useCallback, useEffect } from "preact/hooks";

import { LAYER_PROP_IS_EXPORTING } from "../utils/constants";
import getPermalinkParameters from "../utils/getPermalinkParameters";
import useMapContext from "../utils/hooks/useMapContext";
import usePermalink from "../utils/hooks/usePermalink";

import type { Map } from "ol";
import type { EventsKey } from "ol/events";

/**
 * This component keeps track of the map's state using URL search parameters: x,y,z or layers visibility.
 * WARNING: This component is not responsible for applying the url parameters, only for updating them.
 *
 */
const Permalink = ({ replaceState = false }: { replaceState?: boolean }) => {
  const { map, setPermalinkUrlSearchParams } = useMapContext();

  const permalink = usePermalink();

  // Update the search parameters when the map moves
  const updatePermalink = useCallback(
    (currentMap: Map) => {
      // No update when exporting
      if (map.get(LAYER_PROP_IS_EXPORTING)) {
        return;
      }
      const currentUrlParams = new URLSearchParams(window.location.search);
      const urlParams = getPermalinkParameters(currentMap, currentUrlParams);
      setPermalinkUrlSearchParams(urlParams);
    },
    [map, setPermalinkUrlSearchParams],
  );

  // Replace the window url when permalink changes
  useEffect(() => {
    if (
      replaceState &&
      permalink &&
      permalink !== window.location.href &&
      !permalink.includes(encodeURIComponent("{{"))
    ) {
      window.history.replaceState(null, null, permalink);
    }
  }, [map, permalink, replaceState]);

  useEffect(() => {
    let moveEndKey: EventsKey;
    let loadEndKey: EventsKey;
    let changeVisibleKeys: EventsKey[];
    const updatePermalinkDebounced = debounce(updatePermalink, 1000);

    if (map) {
      updatePermalinkDebounced(map);

      // Update x,y,z in URL on moveend
      moveEndKey = map?.on("moveend", (evt) => {
        updatePermalinkDebounced(evt.map);
      });

      // Update layers in permalink on change:visible event
      loadEndKey = map.once("loadend", (evt) => {
        updatePermalinkDebounced(evt.map);
        changeVisibleKeys = getLayersAsFlatArray(
          evt.map.getLayers().getArray(),
        ).map((layer) => {
          return layer.on("change:visible", () => {
            updatePermalinkDebounced(evt.map);
          });
        });
      });
    }

    return () => {
      unByKey(moveEndKey);
      unByKey(loadEndKey);
      unByKey(changeVisibleKeys);
    };
  }, [map, updatePermalink]);

  return null;
};

export default memo(Permalink);
