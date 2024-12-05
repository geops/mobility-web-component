import {
  MaplibreLayer,
  MaplibreStyleLayer,
  RealtimeLayer as MbtRealtimeLayer,
} from "mobility-toolbox-js/ol";
import {
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
} from "mobility-toolbox-js/types";
import { Map as OlMap } from "ol";
import { memo } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";

import BaseLayer from "../BaseLayer";
import Copyright from "../Copyright";
import GeolocationButton from "../GeolocationButton";
import Map from "../Map";
import NotificationLayer from "../NotificationLayer";
import Overlay from "../Overlay";
import RealtimeLayer from "../RealtimeLayer";
import RouteSchedule from "../RouteSchedule";
import ScaleLine from "../ScaleLine";
import Search from "../Search";
import SingleClickListener from "../SingleClickListener/SingleClickListener";
import Station from "../Station";
import StationsLayer from "../StationsLayer";
// @ts-expect-error bad type definition
import tailwind from "../style.css";
import { I18nContext } from "../utils/hooks/useI18n";
import { MapContext } from "../utils/hooks/useMapContext";
import useUpdatePermalink from "../utils/hooks/useUpdatePermalink";
import i18n from "../utils/i18n";
import MobilityEvent from "../utils/MobilityEvent";
// @ts-expect-error bad type definition
import style from "./index.css";
// Notificationurl example: https://mobility-web-component-tmp.vercel.app/geops-mobility?notificationurl=https%3A%2F%2Fmoco.geops.io%2Fapi%2Fv1%2Fexport%2Fnotification%2F%3Fsso_config%3Dsob&geolocation=false&realtime=false&search=false&notificationat=2024-01-25T22%3A59%3A00Z

export interface MobilityMapProps {
  apikey?: string;
  baselayer?: string;
  center?: string;
  extent?: string;
  geolocation?: string;
  mapsurl?: string;
  maxextent?: string;
  maxzoom?: string;
  minzoom?: string;
  mots?: string;
  notification?: string;
  notificationat?: string; // 2024-01-25T22:59:00Z
  notificationbeforelayerid?: string;
  notificationurl?: string; // https://moco.geops.io/api/v1/export/notification/?sso_config=sob
  permalink?: string;
  realtime?: string;
  realtimeurl?: string;
  search?: string;
  stopsurl?: string;
  tenant?: string;
  zoom?: string;
}

function MobilityMap({
  apikey = null,
  baselayer = "travic_v2",
  center = "831634,5933959",
  extent = null,
  geolocation = "true",
  mapsurl = "https://maps.geops.io",
  maxextent = null,
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
  const [stopSequence, setStopSequence] = useState<RealtimeStopSequence>();
  const [stationsLayer, setStationsLayer] = useState<MaplibreStyleLayer>();
  const [station, setStation] = useState<RealtimeStation>();
  const [realtimeLayer, setRealtimeLayer] = useState<MbtRealtimeLayer>();
  const [map, setMap] = useState<OlMap>();
  const [stationId, setStationId] = useState<RealtimeStationId>();
  const [trainId, setTrainId] = useState<RealtimeTrainId>();

  // TODO: this should be removed. The parent application should be responsible to do this
  // or we should find something that fit more usecases
  const { x, y, z } = useUpdatePermalink(map, permalink === "true");

  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps && MapContextProps
      apikey,
      baselayer,
      baseLayer,
      center,
      extent,
      geolocation,
      isFollowing,
      isTracking,
      map,
      mapsurl,
      maxextent,
      maxzoom,
      minzoom,
      mots,
      notification,
      notificationat,
      notificationbeforelayerid,
      notificationurl,
      permalink,
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
      stationId,
      stationsLayer,
      stopSequence,
      stopsurl,
      tenant,
      trainId,
      zoom,
    };
  }, [
    apikey,
    baselayer,
    baseLayer,
    center,
    extent,
    geolocation,
    isFollowing,
    isTracking,
    map,
    mapsurl,
    maxextent,
    maxzoom,
    minzoom,
    mots,
    notification,
    notificationat,
    notificationbeforelayerid,
    notificationurl,
    permalink,
    realtimeLayer,
    realtimeurl,
    station,
    stationId,
    stationsLayer,
    stopSequence,
    stopsurl,
    tenant,
    trainId,
    zoom,
  ]);

  useEffect(() => {
    dispatchEvent(
      new MobilityEvent<MobilityMapProps>("mwc:attribute", {
        baselayer,
        center: x && y ? `${x},${y}` : center,
        extent,
        geolocation,
        mapsurl,
        maxextent,
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
    extent,
    geolocation,
    mapsurl,
    maxextent,
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

  return (
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <style>{style}</style>
      <MapContext.Provider value={mapContextValue}>
        <div className="relative size-full border font-sans @container/main">
          <div className="relative flex size-full flex-col @lg/main:flex-row-reverse">
            <Map className="relative flex-1 overflow-visible ">
              <BaseLayer />
              <SingleClickListener />
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
                  <Search />
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
