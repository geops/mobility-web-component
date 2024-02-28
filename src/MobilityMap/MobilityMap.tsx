import { memo } from "preact/compat";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { MapBrowserEvent, Map as OlMap } from "ol";
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
import { unByKey } from "ol/Observable";
// @ts-ignore
import tailwind from "../style.css";
// @ts-ignore
import style from "./index.css";
import Map from "../Map";
import NotificationLayer from "../NotificationLayer";
import RouteSchedule from "../RouteSchedule";
import GeolocationButton from "../GeolocationButton";
import BaseLayer from "../BaseLayer";
import { MapContext } from "../utils/hooks/useMapContext";
import RealtimeLayer from "../RealtimeLayer";
import Overlay from "../Overlay";
import ScaleLine from "../ScaleLine";
import Copyright from "../Copyright";
import { I18nContext } from "../utils/hooks/useI18n";
import StationsLayer from "../StationsLayer";
import Station from "../Station";
import MobilityEvent from "../utils/MobilityEvent";
import i18n from "../utils/i18n";

export type MobilityMapProps = {
  apikey?: string;
  baselayer?: string;
  center?: string;
  geolocation?: string;
  maxzoom?: string;
  minzoom?: string;
  mapsurl?: string;
  mots?: string;
  notification?: string;
  notificationat?: string;
  notificationurl?: string;
  notificationbeforelayerid?: string;
  realtime?: string;
  realtimeurl?: string;
  tenant?: string;
  zoom?: string;
};

const useUpdatePermalink = (map) => {
  const [x, setX] = useState<string>(null);
  const [y, setY] = useState<string>(null);
  const [z, setZ] = useState<string>(null);
  useEffect(() => {
    let listener;
    if (map) {
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
        window.history.pushState(null, null, `?${urlParams.toString()}`);
      });
    }
    return () => {
      unByKey(listener);
    };
  }, [map]);
  return { x, y, z };
};

function MobilityMap({
  apikey = null,
  baselayer = "travic_v2",
  center = "831634,5933959",
  geolocation = null,
  mapsurl = "https://maps.geops.io",
  maxzoom = null,
  minzoom = null,
  mots = null,
  notification = "false",
  notificationat = null,
  notificationurl = null,
  notificationbeforelayerid = null,
  realtime = "true",
  realtimeurl = "wss://api.geops.io/tracker-ws/v1/ws",
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
  const { x, y, z } = useUpdatePermalink(map);

  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps
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

      // MapContextProps
      baseLayer,
      isFollowing,
      isTracking,
      stopSequence,
      map,
      realtimeLayer,
      station,
      stationsLayer,
      setBaseLayer,
      setIsFollowing,
      setIsTracking,
      setStopSequence,
      setMap,
      setRealtimeLayer,
      setStation,
      setStationId,
      setTrainId,
      setStationsLayer,
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
      new MobilityEvent("mwc:attribute", {
        baselayer,
        center: `${x},${y}`,
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
        tenant,
        zoom: z,
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
    tenant,
    zoom,
    x,
    y,
    z,
  ]);

  useEffect(() => {
    if (!trainId || !realtimeLayer?.api) {
      return () => {};
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
      return () => {};
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

      // eslint-disable-next-line no-param-reassign
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
    // @ts-ignore
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <style>{style}</style>
      <MapContext.Provider value={mapContextValue}>
        <div className="@container/main w-full h-full relative border font-sans">
          <div className="w-full h-full relative flex flex-col @lg/main:flex-row-reverse">
            <Map className="flex-1 relative overflow-hidden ">
              <BaseLayer />
              {realtime === "true" && <RealtimeLayer />}
              {tenant && <StationsLayer />}
              {notification === "true" && <NotificationLayer />}
              <div className="z-20 absolute right-2 top-2 flex flex-col gap-2">
                <GeolocationButton />
              </div>
              <div className="z-10 absolute left-2 right-2 text-[10px] bottom-2 flex justify-between items-end gap-2">
                <ScaleLine className="bg-slate-50 bg-opacity-70" />
                <Copyright className="bg-slate-50 bg-opacity-70" />
              </div>
            </Map>

            <Overlay
              ScrollableHandlerProps={{
                style: { width: "calc(100% - 60px)" },
              }}
            >
              {realtime === "true" && trainId && (
                <RouteSchedule className="z-5 relative overflow-x-hidden overflow-y-auto  scrollable-inner" />
              )}
              {tenant && stationId && (
                <Station className="z-5 relative overflow-x-hidden overflow-y-auto  scrollable-inner" />
              )}
            </Overlay>
          </div>
        </div>
      </MapContext.Provider>
    </I18nContext.Provider>
  );
}

export default memo(MobilityMap);
