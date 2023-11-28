import { memo } from "preact/compat";
import { useMemo, useState } from "preact/hooks";
import { Map as OlMap } from "ol";
import {
  MaplibreLayer,
  RealtimeLayer as MbtRealtimeLayer,
} from "mobility-toolbox-js/ol";
import rosetta from "rosetta";
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
import I18nContext from "../I18NContext";

const i18n = rosetta({
  de: {
    depature_rail: "Gleis",
    depature_ferry: "Steg",
    depature_other: "Kante",
  },
  en: {
    depature_rail: "platform",
    depature_ferry: "pier",
    depature_other: "stand",
  },
  fr: {
    depature_rail: "voie",
    depature_ferry: "quai",
    depature_other: "quai",
  },
  it: {
    depature_rail: "binario",
    depature_ferry: "imbarcadero",
    depature_other: "corsia",
  },
});

// Set current language to preferred browser language with fallback to english
i18n.locale(
  navigator.languages // @ts-ignore
    .find((l) => i18n.table(l.split("-")[0]) !== undefined)
    ?.split("-")[0] || "en",
);

export type MobilityMapProps = {
  apikey?: string;
  baselayer?: string;
  center?: string;
  geolocation?: string;
  maxzoom?: string;
  minzoom?: string;
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

function MobilityMap({
  apikey = null,
  baselayer = "travic_v2",
  center = "831634,5933959",
  geolocation = null,
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
  const [realtimeLayer, setRealtimeLayer] = useState<MbtRealtimeLayer>();
  const [map, setMap] = useState<OlMap>();

  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps
      apikey,
      baselayer,
      center,
      geolocation,
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
      setBaseLayer,
      setIsFollowing,
      setIsTracking,
      setStopSequence,
      setMap,
      setRealtimeLayer,
    };
  }, [
    apikey,
    baselayer,
    center,
    geolocation,
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
  ]);

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
              {realtime === "true" && !!stopSequence && (
                <RouteSchedule className="z-5 relative overflow-x-hidden overflow-y-auto  scrollable-inner" />
              )}
            </Overlay>
          </div>
        </div>
      </MapContext.Provider>
    </I18nContext.Provider>
  );
}

export default memo(MobilityMap);