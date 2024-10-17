import {
  MapboxStyleLayer,
  MaplibreLayer,
  RealtimeLayer as MbtRealtimeLayer,
} from "mobility-toolbox-js/ol";
import {
  RealtimeStation,
  RealtimeStationId,
  RealtimeTrainId,
} from "mobility-toolbox-js/types";
import { MapBrowserEvent, Map as OlMap } from "ol";
import { unByKey } from "ol/Observable";
import { fromLonLat } from "ol/proj";
import { memo } from "preact/compat";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

import BaseLayer from "../BaseLayer";
import Copyright from "../Copyright";
import GeolocationButton from "../GeolocationButton";
import Map from "../Map";
import NotificationLayer from "../NotificationLayer";
import Overlay from "../Overlay";
import RealtimeLayer from "../RealtimeLayer";
import RouteSchedule from "../RouteSchedule";
import ScaleLine from "../ScaleLine";
import Station from "../Station";
import StationsLayer from "../StationsLayer";
import StopsSearch, { StationFeature } from "../StopsSearch/StopsSearch";
// @ts-expect-error bad type definition
import tailwind from "../style.css";
import { I18nContext } from "../utils/hooks/useI18n";
import { MapContext } from "../utils/hooks/useMapContext";
import i18n from "../utils/i18n";
import MobilityEvent from "../utils/MobilityEvent";
// @ts-expect-error bad type definition
import style from "./index.css";

export interface MobilityMapProps {
  apikey?: string;
  baselayer?: string;
  center?: string;
  geolocation?: string;
  mapsurl?: string;
  maxzoom?: string;
  minzoom?: string;
  mots?: string;
  notification?: string;
  notificationat?: string;
  notificationbeforelayerid?: string;
  notificationurl?: string;
  permalink?: string;
  realtime?: string;
  realtimeurl?: string;
  search?: string;
  stopsurl?: string;
  tenant?: string;
  zoom?: string;
}

const useUpdatePermalink = (map: OlMap, permalink: boolean) => {
  const [x, setX] = useState<string>(null);
  const [y, setY] = useState<string>(null);
  const [z, setZ] = useState<string>(null);
  useEffect(() => {
    let listener;
    if (map && permalink) {
      listener = map.on("moveend", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const newX = map.getView().getCenter()[0].toFixed(2);
        const newY = map.getView().getCenter()[1].toFixed(2);
        const newZ = map.getView().getZoom().toFixed(1);
        setX(newX);
        urlParams.set("x", newX);
        setY(newY);
        urlParams.set("y", newY);
        setZ(newZ);
        urlParams.set("z", newZ);
        window.history.replaceState(null, null, `?${urlParams.toString()}`);
      });
    }
    return () => {
      unByKey(listener);
    };
  }, [map, permalink]);
  return { x, y, z };
};

function MobilityMap({
  apikey = null,
  baselayer = "travic_v2",
  center = "831634,5933959",
  geolocation = "true",
  mapsurl = "https://maps.geops.io",
  maxzoom = null,
  minzoom = null,
  mots = null,
  notification = "true",
  notificationat = null,
  notificationbeforelayerid = null,
  notificationurl = null,
  permalink = "false",
  realtime = "true",
  realtimeurl = "wss://api.geops.io/tracker-ws/v1/ws",
  search = "true",
  stopsurl = "https://api.geops.io/stops/v1/",
  tenant = null,
  zoom = "13",
}: MobilityMapProps) {
  const [baseLayer, setBaseLayer] = useState<MaplibreLayer>();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [stopSequence, setStopSequence] = useState(false);
  const [stationsLayer, setStationsLayer] = useState<MapboxStyleLayer>();
  const [station, setStation] = useState<RealtimeStation>();
  const [realtimeLayer, setRealtimeLayer] = useState<MbtRealtimeLayer>();
  const [map, setMap] = useState<OlMap>();
  const [stationId, setStationId] = useState<RealtimeStationId>();
  const [trainId, setTrainId] = useState<RealtimeTrainId>();
  const { x, y, z } = useUpdatePermalink(map, permalink === "true");

  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps && MapContextProps
      apikey,
      baselayer,
      baseLayer,
      center,
      geolocation,
      isFollowing,
      isTracking,
      map,
      mapsurl,
      maxzoom,
      minzoom,
      mots,
      notification,
      notificationat,
      notificationbeforelayerid,

      notificationurl,
      realtimeLayer,
      realtimeurl,
      setBaseLayer,
      setIsFollowing,
      setIsTracking,
      setMap,
      setRealtimeLayer,
      setStation,
      setStationId,
      setStationsLayer,
      setStopSequence,
      setTrainId,
      station,
      stationsLayer,
      stopSequence,
      tenant,
      zoom,
    };
  }, [
    apikey,
    baselayer,
    center,
    geolocation,
    mapsurl,
    maxzoom,
    minzoom,
    mots,
    notification,
    notificationat,
    notificationurl,
    notificationbeforelayerid,
    realtimeurl,
    tenant,
    zoom,
    baseLayer,
    isFollowing,
    isTracking,
    stopSequence,
    map,
    realtimeLayer,
    station,
    stationsLayer,
  ]);

  useEffect(() => {
    dispatchEvent(
      new MobilityEvent<MobilityMapProps>("mwc:attribute", {
        baselayer,
        center: x && y ? `${x},${y}` : center,
        geolocation,
        mapsurl,
        maxzoom,
        minzoom,
        mots,
        notification,
        notificationat,
        notificationbeforelayerid,
        notificationurl,
        realtime,
        realtimeurl,
        search,
        tenant,
        zoom: z || zoom,
      }),
    );
  }, [
    baselayer,
    center,
    geolocation,
    mapsurl,
    maxzoom,
    minzoom,
    mots,
    notification,
    notificationat,
    notificationurl,
    notificationbeforelayerid,
    realtime,
    realtimeurl,
    search,
    tenant,
    zoom,
    x,
    y,
    z,
  ]);

  useEffect(() => {
    if (!trainId || !realtimeLayer?.api) {
      return;
    }
    realtimeLayer.selectedVehicleId = trainId;
    realtimeLayer.highlightTrajectory(trainId);
    const subscribe = async () => {
      realtimeLayer?.api?.subscribeStopSequence(trainId, ({ content }) => {
        if (content) {
          const [firstStopSequence] = content;
          if (firstStopSequence) {
            setStopSequence(firstStopSequence);
          }
        }
      });
    };
    subscribe();

    return () => {
      setStopSequence(null);
      if (trainId && realtimeLayer) {
        realtimeLayer.api?.unsubscribeStopSequence(trainId);
        realtimeLayer.selectedVehicleId = null;
        realtimeLayer.vectorLayer.getSource().clear();
      }
    };
  }, [trainId, realtimeLayer, realtimeLayer?.api]);

  useEffect(() => {
    if (!stationId || !realtimeLayer?.api) {
      return;
    }
    const subscribe = async () => {
      realtimeLayer?.api?.subscribe(`station ${stationId}`, ({ content }) => {
        if (content) {
          setStation(content);
        }
      });
    };
    subscribe();

    return () => {
      setStation(null);
      if (stationId) {
        realtimeLayer?.api?.unsubscribe(`station ${stationId}`);
      }
    };
  }, [stationId, realtimeLayer?.api]);

  const onPointerMove = useCallback(
    async (evt: MapBrowserEvent<PointerEvent>) => {
      const {
        features: [realtimeFeature],
      } = (await realtimeLayer?.getFeatureInfoAtCoordinate(evt.coordinate)) || {
        features: [],
      };

      const { features: stationsFeatures } =
        (await stationsLayer?.getFeatureInfoAtCoordinate(evt.coordinate)) || {
          features: [],
        };

      const [stationFeature] = stationsFeatures.filter((feat) => {
        return feat.get("tralis_network")?.includes(tenant);
      });

      evt.map.getTargetElement().style.cursor =
        realtimeFeature || stationFeature ? "pointer" : "default";
    },
    [realtimeLayer, stationsLayer, tenant],
  );

  const onSingleClick = useCallback(
    async (evt: MapBrowserEvent<PointerEvent>) => {
      const {
        features: [realtimeFeature],
      } = (await realtimeLayer?.getFeatureInfoAtCoordinate(evt.coordinate)) || {
        features: [],
      };

      const { features: stationsFeatures } =
        (await stationsLayer?.getFeatureInfoAtCoordinate(evt.coordinate)) || {
          features: [],
        };
      const [stationFeature] = stationsFeatures.filter((feat) => {
        return feat.get("tralis_network")?.includes(tenant);
      });
      const newStationId = stationFeature?.get("uid");

      const newTrainId = realtimeFeature?.get("train_id");

      if (newStationId && stationId !== newStationId) {
        setStationId(newStationId);
        setTrainId(null);
      } else if (newTrainId && newTrainId !== trainId) {
        setTrainId(realtimeFeature.get("train_id"));
        setStationId(null);
      } else {
        setTrainId(null);
        setStationId(null);
      }
    },
    [realtimeLayer, stationsLayer, stationId, trainId, tenant],
  );

  const onStopsSearchSelect = useCallback(
    async (selectedStation: StationFeature) => {
      const center = selectedStation?.geometry?.coordinates;
      if (center) {
        map.getView().animate({
          center: fromLonLat(center),
          duration: 500,
          zoom: 16,
        });
      }
    },
    [map],
  );

  useEffect(() => {
    const key = map?.on("singleclick", onSingleClick);
    return () => {
      unByKey(key);
    };
  }, [map, onSingleClick]);

  useEffect(() => {
    const key = map?.on("pointermove", onPointerMove);
    return () => {
      unByKey(key);
    };
  }, [map, onPointerMove]);

  return (
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <style>{style}</style>
      <MapContext.Provider value={mapContextValue}>
        <div className="relative size-full border font-sans @container/main">
          <div className="relative flex size-full flex-col @lg/main:flex-row-reverse">
            <Map className="relative flex-1 overflow-visible ">
              <BaseLayer />
              {realtime === "true" && <RealtimeLayer />}
              {tenant && <StationsLayer />}
              {notification === "true" && <NotificationLayer />}
              <div className="absolute inset-x-2 bottom-2 z-10 flex items-end justify-between gap-2 text-[10px]">
                <ScaleLine className="bg-slate-50/70" />
                <Copyright className="bg-slate-50/70" />
              </div>
              <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
                {geolocation === "true" && <GeolocationButton />}
              </div>
              {search === "true" && (
                <div className="absolute left-2 right-12 top-2 z-10 flex max-h-[90%] min-w-64 max-w-96 flex-col">
                  <StopsSearch
                    apikey={apikey}
                    onselect={onStopsSearchSelect}
                    url={stopsurl}
                  />
                </div>
              )}
            </Map>

            <Overlay
              className={"z-50"}
              ScrollableHandlerProps={{
                style: { width: "calc(100% - 60px)" },
              }}
            >
              {realtime === "true" && trainId && (
                <RouteSchedule className="relative overflow-y-auto  overflow-x-hidden" />
              )}
              {tenant && stationId && (
                <Station className="relative overflow-y-auto  overflow-x-hidden" />
              )}
            </Overlay>
          </div>
        </div>
      </MapContext.Provider>
    </I18nContext.Provider>
  );
}

export default memo(MobilityMap);
