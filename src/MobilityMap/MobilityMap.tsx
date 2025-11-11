import { memo } from "preact/compat";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import BaseLayer from "../BaseLayer";
import FeaturesInfosListener from "../FeaturesInfosListener";
import LayoutState from "../LayoutState";
import LinesNetworkPlanLayer from "../LinesNetworkPlanLayer";
import LinesNetworkPlanLayerHighlight from "../LinesNetworkPlanLayerHighlight";
import MapDispatchEvents from "../MapDispatchEvents";
import MapLayout from "../MapLayout";
import MapsetLayer from "../MapsetLayer";
import NotificationsLayer from "../NotificationsLayer";
import Permalink from "../Permalink";
import RealtimeLayer from "../RealtimeLayer";
import SingleClickListener from "../SingleClickListener";
import StationsLayer from "../StationsLayer";
import { I18nContext } from "../utils/hooks/useI18n";
import useInitialLayersVisiblity from "../utils/hooks/useInitialLayersVisiblity";
import { MapContext } from "../utils/hooks/useMapContext";
import i18n from "../utils/i18n";
import WindowMessageListener from "../WindowMessageListener";

import MobilityMapAttributes from "./MobilityMapAttributes";

// @ts-expect-error bad type definition
import tailwind from "../style.css";
// @ts-expect-error bad type definition
import style from "./index.css";

import type { MapsetLayer as MtbMapsetLayer } from "mobility-toolbox-js/ol";
import type {
  MaplibreLayer,
  MaplibreStyleLayer,
  MocoLayer,
  RealtimeLayer as MtbRealtimeLayer,
} from "mobility-toolbox-js/ol";
import type {
  LayerGetFeatureInfoResponse,
  RealtimeStation,
  RealtimeStationId,
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
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [isEmbed, setIsEmbed] = useState<boolean>(false);
  const [hasGeolocation, setHasGeolocation] = useState<boolean>(false);
  const [hasLnp, setHasLnp] = useState<boolean>(false);
  const [hasDetails, setHasDetails] = useState<boolean>(false);
  const [hasMapset, setHasMapset] = useState<boolean>(false);
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
  const [stationsLayer, setStationsLayer] = useState<MaplibreStyleLayer>();
  const [station, setStation] = useState<RealtimeStation>();
  const [realtimeLayer, setRealtimeLayer] = useState<MtbRealtimeLayer>();
  const [notificationsLayer, setNotificationsLayer] = useState<MocoLayer>();
  const [mapsetLayer, setMapsetLayer] = useState<MtbMapsetLayer>();
  const [linesNetworkPlanLayer, setLinesNetworkPlanLayer] =
    useState<MaplibreStyleLayer>();
  const [map, setMap] = useState<OlMap>();
  const [stationId, setStationId] = useState<RealtimeStationId | string>();
  const [trainId, setTrainId] = useState<RealtimeTrainId>();
  const [linesIds, setLinesIds] = useState<string[]>();
  const [notificationId, setNotificationId] = useState<string>();

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

  const { lang, layers, permalinktemplate } = props;

  // Apply initial visibility of layers
  useInitialLayersVisiblity(map, layers, permalinktemplate);

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
      hasMapset,
      hasNotification,
      hasPermalink,
      hasPrint,
      hasRealtime,
      hasSearch,
      hasShare,
      hasStations,
      hasToolbar,
      isEmbed,
      isExportMenuOpen,
      isFollowing,
      isLayerTreeOpen,
      isOverlayOpen,
      isSearchOpen,
      isShareMenuOpen,
      isTracking,
      linesIds,
      linesNetworkPlanLayer,
      map,
      mapsetLayer,
      notificationId,
      notificationsLayer,
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
      setHasMapset,
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
      setLinesIds,
      setLinesNetworkPlanLayer,
      setMap,
      setMapsetLayer,
      setNotificationId,
      setNotificationsLayer,
      setPermalinkUrlSearchParams,
      setPreviewNotifications,
      setRealtimeLayer,
      setSelectedFeature,
      setSelectedFeatures,
      setStation,
      setStationId,
      setStationsLayer,
      setTrainId,
      station,
      stationId,
      stationsLayer,
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
    hasMapset,
    hasNotification,
    hasPermalink,
    hasPrint,
    hasRealtime,
    hasSearch,
    hasShare,
    hasStations,
    hasToolbar,
    isEmbed,
    isExportMenuOpen,
    isFollowing,
    isLayerTreeOpen,
    isOverlayOpen,
    isSearchOpen,
    isShareMenuOpen,
    isTracking,
    linesIds,
    linesNetworkPlanLayer,
    map,
    mapsetLayer,
    notificationId,
    notificationsLayer,
    permalinkUrlSearchParams,
    previewNotifications,
    realtimeLayer,
    selectedFeature,
    selectedFeatures,
    station,
    stationId,
    stationsLayer,
    trainId,
  ]);

  useEffect(() => {
    i18n.locale(lang);
  }, [lang]);

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
        {hasNotification && <NotificationsLayer />}
        {hasRealtime && <RealtimeLayer />}
        {hasStations && <StationsLayer />}
        {hasLnp && <LinesNetworkPlanLayer />}
        {hasLnp && <LinesNetworkPlanLayerHighlight />}
        {hasMapset && <MapsetLayer />}

        {/* Layout  */}
        <div
          className="@container/main relative size-full border font-sans"
          ref={eventNodeRef}
        >
          <MapLayout />
        </div>
      </MapContext.Provider>
    </I18nContext.Provider>
  );
}

const MemoMobilityMap = memo(MobilityMap);

// We creates a wrapper to inject the default props values from MobilityMapAttributes.
const defaultProps: Partial<MobilityMapProps> = {};
Object.entries(MobilityMapAttributes).forEach(([key]) => {
  defaultProps[key] = MobilityMapAttributes[key].defaultValue || null;
});

function MobilityMapWithDefaultProps(props: MobilityMapProps) {
  return <MemoMobilityMap {...defaultProps} {...props} />;
}

export default memo(MobilityMapWithDefaultProps);
