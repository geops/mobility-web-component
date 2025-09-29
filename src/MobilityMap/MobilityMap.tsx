import { memo } from "preact/compat";
import { useMemo, useRef, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import BaseLayer from "../BaseLayer";
import Copyright from "../Copyright";
import EmbedNavigation from "../EmbedNavigation";
import ExportMenuButton from "../ExportMenuButton";
import FeaturesInfosListener from "../FeaturesInfosListener";
import GeolocationButton from "../GeolocationButton";
import LayerTreeButton from "../LayerTreeButton";
import LayoutState from "../LayoutState";
import LinesNetworkPlanLayer from "../LinesNetworkPlanLayer";
import Map from "../Map";
import MapDispatchEvents from "../MapDispatchEvents";
import NotificationLayer from "../NotificationLayer";
import Overlay from "../Overlay";
import OverlayContent from "../OverlayContent";
import Permalink from "../Permalink";
import RealtimeLayer from "../RealtimeLayer";
import ScaleLine from "../ScaleLine";
import Search from "../Search";
import SearchButton from "../SearchButton";
import ShareMenuButton from "../ShareMenuButton";
import SingleClickListener from "../SingleClickListener";
import StationsLayer from "../StationsLayer";
import { I18nContext } from "../utils/hooks/useI18n";
import { MapContext } from "../utils/hooks/useMapContext";
import i18n from "../utils/i18n";
import WindowMessageListener from "../WindowMessageListener";
import ZoomButtons from "../ZoomButtons";

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
  LayerGetFeatureInfoResponse,
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

const scrollableHandlerProps = {
  style: { width: "calc(100% - 60px)" },
};

function MobilityMap(props: MobilityMapProps) {
  const eventNodeRef = useRef<HTMLDivElement>();
  const [baseLayer, setBaseLayer] = useState<MaplibreLayer>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isEmbed, setIsEmbed] = useState<boolean>(false);
  const [hasGeolocation, setHasGeolocation] = useState<boolean>(false);
  const [hasLnp, setHasLnp] = useState<boolean>(false);
  const [hasDetails, setHasDetails] = useState<boolean>(false);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [hasPermalink, setHasPermalink] = useState<boolean>(false);
  const [hasPrint, setHasPrint] = useState<boolean>(false);
  const [hasRealtime, setHasRealtime] = useState<boolean>(false);
  const [hasSearch, setHasSearch] = useState<boolean>(false);
  const [hasStations, setHasStations] = useState<boolean>(false);
  const [hasToolbar, setHasToolbar] = useState<boolean>(false);
  const [hasShare, setHasShare] = useState<boolean>(false);
  const [hasLayerTree, setHasLayerTree] = useState<boolean>(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  const [isLayerTreeOpen, setIsLayerTreeOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [stopSequence, setStopSequence] = useState<RealtimeStopSequence>();
  const [stationsLayer, setStationsLayer] = useState<MaplibreStyleLayer>();
  const [station, setStation] = useState<RealtimeStation>();
  const [realtimeLayer, setRealtimeLayer] = useState<MbtRealtimeLayer>();
  const [map, setMap] = useState<OlMap>();
  const [stationId, setStationId] = useState<RealtimeStationId>();
  const [trainId, setTrainId] = useState<RealtimeTrainId>();
  const [featuresInfos, setFeaturesInfos] = useState<
    LayerGetFeatureInfoResponse[]
  >([]);
  const [featuresInfosHovered, setFeaturesInfosHovered] = useState<
    LayerGetFeatureInfoResponse[]
  >([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [permalinkUrlSearchParams, setPermalinkUrlSearchParams] =
    useState<URLSearchParams>();

  const [previewNotifications, setPreviewNotifications] =
    useState<SituationType[]>();

  // Object representing all the web-component attributes and the map context values.
  const mapContextValue = useMemo(() => {
    return {
      // MobilityMapProps
      ...props,
      // MapContextProps
      baseLayer,
      featuresInfos,
      featuresInfosHovered,
      hasDetails,
      hasGeolocation,
      hasLayerTree,
      hasLnp,
      hasNotification,
      hasPermalink,
      hasPrint,
      hasRealtime,
      hasSearch,
      hasShare,
      hasToolbar,
      isEmbed,
      isExportMenuOpen,
      isFollowing,
      isLayerTreeOpen,
      isOverlayOpen,
      isSearchOpen,
      isShareMenuOpen,
      isTracking,
      map,
      permalinkUrlSearchParams,
      previewNotifications,
      realtimeLayer,
      selectedFeature,
      selectedFeatures,
      setBaseLayer,
      setFeaturesInfos,
      setFeaturesInfosHovered,
      setHasDetails,
      setHasGeolocation,
      setHasLayerTree,
      setHasLnp,
      setHasNotification,
      setHasPermalink,
      setHasPrint,
      setHasRealtime,
      setHasSearch,
      setHasShare,
      setHasStations,
      setHasToolbar,
      setIsEmbed,
      setIsExportMenuOpen,
      setIsFollowing,
      setIsLayerTreeOpen,
      setIsOverlayOpen,
      setIsSearchOpen,
      setIsShareMenuOpen,
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
    featuresInfos,
    featuresInfosHovered,
    hasDetails,
    hasGeolocation,
    hasLayerTree,
    hasLnp,
    hasNotification,
    hasPermalink,
    hasPrint,
    hasRealtime,
    hasSearch,
    hasShare,
    hasToolbar,
    isEmbed,
    isExportMenuOpen,
    isFollowing,
    isLayerTreeOpen,
    isOverlayOpen,
    isSearchOpen,
    isShareMenuOpen,
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

  console.log("Render MobilityMap", hasRealtime, trainId);

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
        <LayoutState />
        <Permalink replaceState={hasPermalink} />
        <MapDispatchEvents node={eventNodeRef.current} wcAttributes={props} />
        <WindowMessageListener eventNode={eventNodeRef.current} />
        <SingleClickListener />
        <FeaturesInfosListener />

        {/* Layers */}
        <BaseLayer />
        {hasNotification && <NotificationLayer />}
        {hasRealtime && <RealtimeLayer />}
        {hasStations && <StationsLayer />}
        {hasLnp && <LinesNetworkPlanLayer />}

        {/* Layout  */}
        <div
          className="@container/main relative size-full border font-sans"
          ref={eventNodeRef}
        >
          <div className="relative flex size-full flex-col @lg/main:flex-row-reverse">
            <Map className="relative flex-1 overflow-visible">
              <EmbedNavigation />

              <div className="absolute inset-x-2 bottom-2 z-10 flex items-end justify-between gap-2 text-[10px]">
                <ScaleLine className="bg-slate-50/70" />
                <Copyright className="bg-slate-50/70" />
              </div>

              <div className="absolute right-2 bottom-10 z-10 flex flex-col justify-between gap-2">
                <ZoomButtons />
              </div>

              {hasGeolocation && (
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                  <GeolocationButton />
                </div>
              )}

              {!hasToolbar && hasSearch && (
                <div className="absolute top-2 right-12 left-2 z-10 flex max-h-[90%] max-w-96 min-w-64 flex-col">
                  <Search />
                </div>
              )}
            </Map>

            <div className="pointer-events-none absolute top-2 bottom-2 left-2 z-10 flex flex-col gap-2 *:pointer-events-auto">
              <div
                className={
                  "relative z-10 w-fit rounded-2xl bg-black/10 p-0 backdrop-blur-sm"
                }
                //  className="w-fit rounded-2xl bg-black/10 p-1 backdrop-blur-sm">
              >
                <div
                  className={twMerge(
                    "absolute top-12 left-0 h-[40px] w-0 p-0 opacity-0 transition-all @sm:top-0 @sm:left-[calc(100%-43px)] @md:left-[calc(100%-47px)]",
                    isSearchOpen ? "w-64 opacity-100" : "",
                  )}
                >
                  <Search
                    className={
                      "border-grey @container m-0 h-[40px] rounded-2xl border p-2 px-4 text-base @sm/main:h-[44px] @sm/main:rounded-l-none @sm/main:rounded-r-2xl @md/main:h-[48px]"
                    }
                    inputClassName="h-6 text-base"
                    inputContainerClassName="border-none"
                    resultClassName="text-base  **:hover:cursor-pointer hover:text-red-500 p-2"
                    resultsContainerClassName="@container rounded-b-2xl max-h-[200px] overflow-y-auto border border-grey border-t-0 "
                    withResultsClassName="text-base !rounded-b-none"
                  />
                </div>
                {hasToolbar && (
                  <div
                    className={twMerge(
                      "border-grey relative flex gap-[1px] overflow-hidden rounded-2xl border",
                      "*:size-[38px] *:rounded-none *:border-none *:@sm/main:size-[42px] *:@md/main:!size-[46px]",
                      "*:first:!rounded-l-2xl",
                      "*:last:!rounded-r-2xl",
                      isSearchOpen
                        ? "@sm:rounded-r-none @sm:border-r-0 @sm:*:last:!rounded-r-none @sm:*:last:border-r-0"
                        : "",
                    )}
                  >
                    {hasPrint && <ExportMenuButton title={"Drucken"} />}
                    {hasShare && <ShareMenuButton title={"Share"} />}
                    {hasLayerTree && <LayerTreeButton title={"Layers"} />}
                    {hasSearch && <SearchButton title={"Suche"} />}
                  </div>
                )}
              </div>

              {/* Desktop (>= lg) */}
              {isOverlayOpen && (
                <div
                  className={twMerge(
                    "flex w-0 flex-1 flex-col overflow-hidden rounded-2xl @lg:min-w-64",
                  )}
                  style={{ containerType: "normal" }}
                >
                  <Overlay
                    className={
                      "border-grey @container/overlay pointer-events-auto relative hidden flex-col overflow-hidden rounded-2xl border bg-white text-base shadow-lg @lg:flex"
                    }
                    ScrollableHandlerProps={scrollableHandlerProps}
                  >
                    <OverlayContent
                      hasDetails={hasDetails}
                      hasLayerTree={hasLayerTree}
                      hasPrint={hasPrint}
                      hasRealtime={hasRealtime}
                      hasSearch={false}
                      hasShare={hasShare}
                    />
                  </Overlay>
                </div>
              )}
            </div>

            {/* Mobile (< lg) */}
            {isOverlayOpen && (
              <Overlay
                className={
                  "absolute bottom-0 z-20 flex max-h-[70%] min-h-[75px] w-full flex-col border-t bg-white @lg:hidden"
                }
                ScrollableHandlerProps={scrollableHandlerProps}
              >
                <OverlayContent
                  hasDetails={hasDetails}
                  hasLayerTree={hasLayerTree}
                  hasPrint={hasPrint}
                  hasRealtime={hasRealtime}
                  hasSearch={false}
                  hasShare={hasShare}
                />
              </Overlay>
            )}
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
