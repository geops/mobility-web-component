import { memo } from "preact/compat";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import BaseLayer from "../BaseLayer";
import Copyright from "../Copyright";
import EmbedNavigation from "../EmbedNavigation";
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
import { I18nContext } from "../utils/hooks/useI18n";
import { MapContext } from "../utils/hooks/useMapContext";
import useUpdatePermalink from "../utils/hooks/useUpdatePermalink";
import i18n from "../utils/i18n";
import MobilityEvent from "../utils/MobilityEvent";
import WindowMessageListener from "../WindowMessageListener";

// @ts-expect-error bad type definition
import tailwind from "../style.css";
// @ts-expect-error bad type definition
import style from "./index.css";

import type {
  MaplibreLayer,
  MaplibreStyleLayer,
  RealtimeLayer as MbtRealtimeLayer,
} from "mobility-toolbox-js/ol";
import type { MocoLayerOptions } from "mobility-toolbox-js/ol/layers/MocoLayer";
import type {
  MocoNotification,
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
} from "mobility-toolbox-js/types";
import type { Feature, Map as OlMap } from "ol";
// Notificationurl example: https://mobility-web-component-tmp.vercel.app/geops-mobility?notificationurl=https%3A%2F%2Fmoco.geops.io%2Fapi%2Fv1%2Fexport%2Fnotification%2F%3Fsso_config%3Dsob&geolocation=false&realtime=false&search=false&notificationat=2024-01-25T22%3A59%3A00Z

export interface MobilityMapProps {
  apikey?: string;
  baselayer?: string;
  center?: string;
  embed?: string; // "false" | "true"
  extent?: string;
  geolocation?: string;
  mapsurl?: string;
  maxextent?: string;
  maxzoom?: string;
  minzoom?: string;
  mots?: string;
  notification?: string;
  notificationat?: string; // 2024-01-25T22:59:00Z
  notificationtenant?: string;
  notificationurl?: string; // https://moco.geops.io/api/v1/
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
  embed = "false",
  extent = null,
  geolocation = "true",
  mapsurl = "https://maps.geops.io",
  maxextent = null,
  maxzoom = null,
  minzoom = null,
  mots = null,
  notification = "false",
  notificationat = null, //"2025-09-10T00:00:00Z",
  notificationtenant = null,
  notificationurl = "https://moco.geops.io/api/v1/",
  permalink = "false",
  realtime = "true",
  realtimeurl = "wss://api.geops.io/tracker-ws/v1/ws",
  search = "true",
  stopsurl = "https://api.geops.io/stops/v1/",
  tenant = null,
  zoom = "13",
}: MobilityMapProps) {
  const eventNodeRef = useRef<HTMLDivElement>();
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
  const [selectedFeature, setSelectedFeature] = useState<Feature>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);

  const [previewNotification, setPreviewNotification] =
    useState<MocoNotification[]>();

  const hasRealtime = useMemo(() => {
    return realtime === "true";
  }, [realtime]);

  const hasNotification = useMemo(() => {
    return notification === "true" || !!previewNotification;
  }, [notification, previewNotification]);

  const hasGeolocation = useMemo(() => {
    return geolocation === "true";
  }, [geolocation]);

  const hasSearch = useMemo(() => {
    return search === "true";
  }, [search]);

  const isEmbed = useMemo(() => {
    return embed === "true";
  }, [embed]);

  // TODO: this should be removed. The parent application should be responsible to do this
  // or we should find something that fit more usecases
  useUpdatePermalink(map, permalink === "true", eventNodeRef);

  const wcAttributesValues = useMemo<MobilityMapProps>(() => {
    return {
      apikey,
      baselayer,
      center,
      embed,
      extent,
      geolocation,
      mapsurl,
      maxextent,
      maxzoom,
      minzoom,
      mots,
      notification,
      notificationat,
      notificationtenant,
      notificationurl,
      permalink,
      realtime,
      realtimeurl,
      search,
      stopsurl,
      tenant,
      zoom,
    };
  }, [
    apikey,
    baselayer,
    center,
    embed,
    extent,
    geolocation,
    mapsurl,
    maxextent,
    maxzoom,
    minzoom,
    mots,
    notification,
    notificationat,
    notificationtenant,
    notificationurl,
    permalink,
    realtime,
    realtimeurl,
    search,
    stopsurl,
    tenant,
    zoom,
  ]);

  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps
      ...wcAttributesValues,
      // MapContextProps
      baseLayer,
      isEmbed,
      isFollowing,
      isTracking,
      map,
      previewNotification,
      realtimeLayer,
      selectedFeature,
      selectedFeatures,
      setBaseLayer,
      setIsFollowing,
      setIsTracking,
      setMap,
      setPreviewNotification,
      setRealtimeLayer,
      setSelectedFeature,
      setSelectedFeatures,
      setStation,
      setStationId,
      setStationsLayer,
      setStopSequence,
      setTrainId,
      station,
      stationId,
      stationsLayer,
      stopSequence,
      trainId,
    };
  }, [
    wcAttributesValues,
    baseLayer,
    isEmbed,
    isFollowing,
    isTracking,
    map,
    previewNotification,
    realtimeLayer,
    selectedFeature,
    selectedFeatures,
    station,
    stationId,
    stationsLayer,
    stopSequence,
    trainId,
  ]);

  useEffect(() => {
    eventNodeRef.current?.dispatchEvent(
      new MobilityEvent<MobilityMapProps>("mwc:attribute", wcAttributesValues, {
        bubbles: true,
      }),
    );
  }, [wcAttributesValues]);

  const notificationsLayerProps: MocoLayerOptions = useMemo(() => {
    return {
      apiKey: apikey,
      date: notificationat ? new Date(notificationat) : undefined,
      isQueryable: true,
      notifications: previewNotification,
      tenant: notificationtenant,
      title: "Notifications",
      url: notificationurl,
    };
  }, [
    apikey,
    notificationat,
    notificationtenant,
    notificationurl,
    previewNotification,
  ]);

  return (
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <style>{style}</style>
      <MapContext.Provider value={mapContextValue}>
        <WindowMessageListener eventNode={eventNodeRef.current} />
        <div
          className="@container/main relative size-full border font-sans"
          ref={eventNodeRef}
        >
          <div className="relative flex size-full flex-col @lg/main:flex-row-reverse">
            <Map className="relative flex-1 overflow-visible">
              <BaseLayer />
              <SingleClickListener />
              <EmbedNavigation />

              {hasNotification && (
                <NotificationLayer {...notificationsLayerProps} />
              )}
              {hasRealtime && <RealtimeLayer />}
              {tenant && <StationsLayer />}
              <div className="absolute inset-x-2 bottom-2 z-10 flex items-end justify-between gap-2 text-[10px]">
                <ScaleLine className="bg-slate-50/70" />
                <Copyright className="bg-slate-50/70" />
              </div>
              <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                {hasGeolocation && <GeolocationButton />}
              </div>
              {hasSearch && (
                <div className="absolute top-2 right-12 left-2 z-10 flex max-h-[90%] max-w-96 min-w-64 flex-col">
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
              {hasRealtime && trainId && (
                <RouteSchedule className="relative overflow-x-hidden overflow-y-auto" />
              )}
              {tenant && stationId && (
                <Station className="relative overflow-x-hidden overflow-y-auto" />
              )}
            </Overlay>
          </div>
        </div>
      </MapContext.Provider>
    </I18nContext.Provider>
  );
}

export default memo(MobilityMap);
