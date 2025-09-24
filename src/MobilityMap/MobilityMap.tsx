import { memo } from "preact/compat";
import { useMemo, useRef, useState } from "preact/hooks";

import BaseLayer from "../BaseLayer";
import Copyright from "../Copyright";
import EmbedNavigation from "../EmbedNavigation";
import GeolocationButton from "../GeolocationButton";
import Map from "../Map";
import MapDispatchEvents from "../MapDispatchEvents";
import NotificationLayer from "../NotificationLayer";
import Overlay from "../Overlay";
import Permalink from "../Permalink";
import RealtimeLayer from "../RealtimeLayer";
import RouteSchedule from "../RouteSchedule";
import ScaleLine from "../ScaleLine";
import Search from "../Search";
import SingleClickListener from "../SingleClickListener/SingleClickListener";
import Station from "../Station";
import StationsLayer from "../StationsLayer";
import { I18nContext } from "../utils/hooks/useI18n";
import { MapContext } from "../utils/hooks/useMapContext";
import i18n from "../utils/i18n";
import WindowMessageListener from "../WindowMessageListener";

import MobilityMapAttributes from "./MobilityMapAttributes";

// @ts-expect-error bad type definition
import tailwind from "../style.css";
// @ts-expect-error bad type definition
import style from "./index.css";

import type {
  MaplibreLayer,
  MaplibreStyleLayer,
  RealtimeLayer as MbtRealtimeLayer,
} from "mobility-toolbox-js/ol";
import type {
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
  SituationType,
} from "mobility-toolbox-js/types";
import type { Feature, Map as OlMap } from "ol";

import type { MobilityMapAttributeName } from "./MobilityMapAttributes";

export type MobilityMapProps = Record<
  MobilityMapAttributeName,
  null | string | undefined
>;

function MobilityMap(props: MobilityMapProps) {
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
  const [permalinkUrlSearchParams, setPermalinkUrlSearchParams] =
    useState<URLSearchParams>();

  const [previewNotifications, setPreviewNotifications] =
    useState<SituationType[]>();

  const {
    embed,
    geolocation,
    notification,
    permalink,
    realtime,
    search,
    tenant,
  } = props;

  const hasRealtime = useMemo(() => {
    return realtime === "true";
  }, [realtime]);

  const hasNotification = useMemo(() => {
    return notification === "true" || !!previewNotifications;
  }, [notification, previewNotifications]);

  const hasGeolocation = useMemo(() => {
    return geolocation === "true";
  }, [geolocation]);

  const hasPermalink = useMemo(() => {
    return permalink === "true";
  }, [permalink]);

  const hasSearch = useMemo(() => {
    return search === "true";
  }, [search]);

  const isEmbed = useMemo(() => {
    return embed === "true";
  }, [embed]);

  // Object representing all the web-component attributes and the map context values.
  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps
      ...props,
      // MapContextProps
      baseLayer,
      isEmbed,
      isFollowing,
      isTracking,
      map,
      permalinkUrlSearchParams,
      previewNotifications,
      realtimeLayer,
      selectedFeature,
      selectedFeatures,
      setBaseLayer,
      setIsFollowing,
      setIsTracking,
      setMap,
      setPermalinkUrlSearchParams,
      setPreviewNotifications,
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
    props,
    baseLayer,
    isEmbed,
    isFollowing,
    isTracking,
    map,
    permalinkUrlSearchParams,
    previewNotifications,
    realtimeLayer,
    selectedFeature,
    selectedFeatures,
    station,
    stationId,
    stationsLayer,
    stopSequence,
    trainId,
  ]);

  return (
    <I18nContext.Provider value={i18n}>
      {/* There is a bug in tailwindcss@4 , variables are not imported in the shadow dom
      see  https://github.com/tailwindlabs/tailwindcss/issues/15005*/}
      <style>
        {`:host {
            --tw-divide-y-reverse: 0;
            --tw-border-style: solid;
            --tw-font-weight: initial;
            --tw-tracking: initial;
            --tw-translate-x: 0;
            --tw-translate-y: 0;
            --tw-translate-z: 0;
            --tw-rotate-x: rotateX(0);
            --tw-rotate-y: rotateY(0);
            --tw-rotate-z: rotateZ(0);
            --tw-skew-x: skewX(0);
            --tw-skew-y: skewY(0);
            --tw-space-x-reverse: 0;
            --tw-gradient-position: initial;
            --tw-gradient-from: #0000;
            --tw-gradient-via: #0000;
            --tw-gradient-to: #0000;
            --tw-gradient-stops: initial;
            --tw-gradient-via-stops: initial;
            --tw-gradient-from-position: 0%;
            --tw-gradient-via-position: 50%;
            --tw-gradient-to-position: 100%;
            --tw-shadow: 0 0 #0000;
            --tw-shadow-color: initial;
            --tw-inset-shadow: 0 0 #0000;
            --tw-inset-shadow-color: initial;
            --tw-ring-color: initial;
            --tw-ring-shadow: 0 0 #0000;
            --tw-inset-ring-color: initial;
            --tw-inset-ring-shadow: 0 0 #0000;
            --tw-ring-inset: initial;
            --tw-ring-offset-width: 0px;
            --tw-ring-offset-color: #fff;
            --tw-ring-offset-shadow: 0 0 #0000;
            --tw-blur: initial;
            --tw-brightness: initial;
            --tw-contrast: initial;
            --tw-grayscale: initial;
            --tw-hue-rotate: initial;
            --tw-invert: initial;
            --tw-opacity: initial;
            --tw-saturate: initial;
            --tw-sepia: initial;
            --tw-drop-shadow: initial;
            --tw-duration: initial;
            --tw-ease: initial;
        }`}
      </style>
      <style>{tailwind}</style>
      <style>{style}</style>
      <MapContext.Provider value={mapContextValue}>
        <Permalink replaceState={hasPermalink} />
        <MapDispatchEvents node={eventNodeRef.current} wcAttributes={props} />
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

              {hasNotification && <NotificationLayer />}
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

// We creates a wrapper to inject the default props values from MobilityMapAttributes.
const defaultProps = {};
Object.entries(MobilityMapAttributes).forEach(([key]) => {
  defaultProps[key] = MobilityMapAttributes[key].defaultValue || null;
});

function MobilityMapWithDefaultProps(props: MobilityMapProps) {
  return <MobilityMap {...defaultProps} {...props} />;
}

export default memo(MobilityMapWithDefaultProps);
