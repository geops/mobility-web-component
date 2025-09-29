import debounce from "lodash.debounce";
import { getFeatureInfoAtCoordinate } from "mobility-toolbox-js/ol";
import { unByKey } from "ol/Observable";
import { useCallback, useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";

import type { DebounceSettings } from "lodash";
import type { MapBrowserEvent } from "ol";
import type { EventsKey } from "ol/events";

export interface SingleClickListenerProps {
  debounceOptions?: DebounceSettings;
  debounceTimeout?: number;
  hover?: boolean;
}

function SingleClickListener({
  debounceOptions,
  debounceTimeout = 0,
  hover = true,
}: SingleClickListenerProps) {
  const { map, queryablelayers, setFeaturesInfos, setFeaturesInfosHovered } =
    useMapContext();

  const getFeaturesInfosAtEvt = useCallback(
    async (evt: MapBrowserEvent<PointerEvent>) => {
      const queryableLayers = evt.map.getAllLayers().filter((l) => {
        return queryablelayers.split(",").includes(l.get("name"));
      });
      const featuresInfos = await getFeatureInfoAtCoordinate(
        evt.coordinate,
        queryableLayers,
        5,
        true,
      );
      return featuresInfos;
    },
    [queryablelayers],
  );

  const onPointerMove = useCallback(
    async (evt: MapBrowserEvent<PointerEvent>) => {
      const featureInfos = await getFeaturesInfosAtEvt(evt);
      setFeaturesInfosHovered(featureInfos);
      const features = featureInfos.flatMap((featureInfo) => {
        return featureInfo.features;
      });

      evt.map.getTargetElement().style.cursor = features?.length
        ? "pointer"
        : "default";
    },
    [getFeaturesInfosAtEvt, setFeaturesInfosHovered],
  );

  const onSingleClick = useCallback(
    async (evt: MapBrowserEvent<PointerEvent>) => {
      const featuresInfos = await getFeaturesInfosAtEvt(evt);
      setFeaturesInfos(featuresInfos);
    },
    [getFeaturesInfosAtEvt, setFeaturesInfos],
  );

  useEffect(() => {
    const key = map?.on("singleclick", onSingleClick);
    return () => {
      unByKey(key);
    };
  }, [map, onSingleClick]);

  useEffect(() => {
    let key: EventsKey;
    if (hover) {
      let debounced = onPointerMove;
      if (debounceTimeout) {
        debounced = debounce(onPointerMove, debounceTimeout, debounceOptions);
      }
      key = map?.on("pointermove", debounced);
    }
    return () => {
      unByKey(key);
    };
  }, [debounceOptions, debounceTimeout, hover, map, onPointerMove]);

  return null;
}
export default SingleClickListener;
