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
  const {
    map,
    mots,
    queryablelayers,
    setFeaturesInfos,
    setFeaturesInfosHovered,
    setLinesIds,
    setNotificationId,
    setStationId,
    setTrainId,
    stationsLayer,
    tenant,
  } = useMapContext();

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

      // Filter the features clicked in the stations layer by the tenant
      if (stationsLayer) {
        // Clean the features infos stations clicked
        const featuresInfoStations = featuresInfos?.find((info) => {
          return info.layer === stationsLayer;
        });
        const stationsFeatures = featuresInfoStations?.features || [];

        const [stationFeature] = stationsFeatures.filter((feat) => {
          let found = false;
          if (mots?.split(",")?.length > 0) {
            found = !!mots.split(",").find((mot) => {
              const hasMot = feat.get(mot.trim().toLowerCase());
              if (hasMot === 1) {
                return true;
              }
            });
          }

          // We move the external_id to uid to be consistent across all stations (lnp and others)
          if (!feat.get("uid") && feat.get("external_id")) {
            feat.set("uid", feat.get("external_id"));
          }

          // Travic stations have a tralis_network property and mots property
          if (found) {
            return !!feat.get("tralis_network")?.includes(tenant);
          }

          // LNP stations have network property with CamelCase value like "Trenord"
          if (feat.get("network")) {
            return feat.get("network").toLowerCase().includes(tenant);
          }
          return found;
        });

        // Replace the features clicked in the stations layer by the filtered one
        if (featuresInfoStations) {
          featuresInfoStations.features = stationFeature
            ? [stationFeature]
            : [];
        }
      }

      return featuresInfos;
    },
    [mots, queryablelayers, stationsLayer, tenant],
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
      // When user click we close the overlay
      if (
        featuresInfos?.flatMap((fi) => {
          return fi.features;
        }).length === 0
      ) {
        // It means no feature selectable were clicked so we set all ids to null
        // to close the overlay
        setTrainId(null);
        setStationId(null);
        setNotificationId(null);
        setLinesIds(null);
      }
    },
    [
      getFeaturesInfosAtEvt,
      setFeaturesInfos,
      setLinesIds,
      setNotificationId,
      setStationId,
      setTrainId,
    ],
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
