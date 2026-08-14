/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type {
  MaplibreLayer,
  MaplibreStyleLayer,
  MapsetLayer,
  MocoLayer,
  RealtimeLayer,
} from "mobility-toolbox-js/ol";
import type {
  LayerGetFeatureInfoResponse,
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
  SituationType,
} from "mobility-toolbox-js/types";
import type { Feature, Map } from "ol";

import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

export type MapContextType = {
  baseLayer?: MaplibreLayer;
  defaultProps?: Partial<MobilityMapProps>;
  featuresInfos?: LayerGetFeatureInfoResponse[];
  featuresInfosHovered?: LayerGetFeatureInfoResponse[];
  hasDetails?: boolean;
  hasGeolocation?: boolean;
  hasLayerTree?: boolean;
  hasLnp?: boolean;
  hasMapset?: boolean;
  hasNotification?: boolean;
  hasPermalink?: boolean;
  hasPrint?: boolean;
  hasRealtime?: boolean;
  hasSearch?: boolean;
  hasShare?: boolean;
  hasStations?: boolean;
  hasToolbar?: boolean;
  isEmbed?: boolean;
  isExportMenuOpen?: boolean;
  isFollowing?: boolean;
  isLayerTreeOpen?: boolean;
  isOverlayOpen?: boolean;
  isSearchOpen?: boolean;
  isShareMenuOpen?: boolean;
  isTracking?: boolean;
  linesIds?: string[];
  linesNetworkPlanLayer?: MaplibreStyleLayer;
  map?: Map;
  mapsetLayer?: MapsetLayer;
  notificationId?: string;
  notificationsLayer?: MocoLayer;
  notificationSupportedLanguages?: string[];
  permalinkUrlSearchParams?: URLSearchParams;
  previewNotifications?: SituationType[];
  realtimeLayer?: RealtimeLayer;
  selectedFeature?: Feature;
  selectedFeatures?: Feature[];
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setFeaturesInfos: (featuresInfos: LayerGetFeatureInfoResponse[]) => void;
  setFeaturesInfosHovered: (
    featuresInfos: LayerGetFeatureInfoResponse[],
  ) => void;
  setHasDetails: (hasDetails: boolean) => void;
  setHasGeolocation: (hasGeolocation: boolean) => void;
  setHasLayerTree: (hasLayerTree: boolean) => void;
  setHasLnp: (hasLnp: boolean) => void;
  setHasMapset: (hasMapset: boolean) => void;
  setHasNotification: (hasNotification: boolean) => void;
  setHasPermalink: (hasPermalink: boolean) => void;
  setHasPrint: (hasPrint: boolean) => void;
  setHasRealtime: (hasRealtime: boolean) => void;
  setHasSearch: (hasSearch: boolean) => void;
  setHasShare: (hasShare: boolean) => void;
  setHasStations: (hasStations: boolean) => void;
  setHasToolbar: (hasToolbar: boolean) => void;
  setIsEmbed: (isEmbed: boolean) => void;
  setIsExportMenuOpen: (isExportMenuOpen: boolean) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setIsLayerTreeOpen: (isLayerTreeOpen: boolean) => void;
  setIsOverlayOpen: (isOverlayOpen: boolean) => void;
  setIsSearchOpen: (isSearchOpen: boolean) => void;
  setIsShareMenuOpen: (isShareMenuOpen: boolean) => void;
  setIsTracking: (isTracking: boolean) => void;
  setLinesIds: (linesIds: string[]) => void;
  setLinesNetworkPlanLayer: (layer?: MaplibreStyleLayer) => void;
  setMap: (map?: Map) => void;
  setMapsetLayer: (mapsetLayer?: MapsetLayer) => void;
  setNotificationId: (notificationId?: string) => void;
  setNotificationsLayer: (notificationsLayer?: MocoLayer) => void;
  setNotificationSupportedLanguages: (langs: string[]) => void;
  setPermalinkUrlSearchParams: (
    setPermalinkUrlSearchParams: URLSearchParams,
  ) => void;
  setPreviewNotifications: (setPreviewNotifications?: SituationType[]) => void;
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => void;
  setSelectedFeature: (feature: Feature) => void;
  setSelectedFeatures: (features: Feature[]) => void;
  setStation: (station?: RealtimeStation) => void;
  setStationId: (stationId?: RealtimeStationId) => void;
  setStationsLayer: (stationsLayer?: MaplibreStyleLayer) => void;
  setTrainId: (trainId?: RealtimeTrainId) => void;
  station?: RealtimeStation;
  stationId?: RealtimeStationId;
  stationsLayer?: MaplibreStyleLayer;
  trainId?: RealtimeTrainId;
} & MobilityMapProps;

// Set default values for setters to avoid having to check if they exist before calling them
const defaultState: Partial<MapContextType> = {
  setBaseLayer: (_baseLayer?: MaplibreLayer) => {},
  setFeaturesInfos: (_featuresInfos: LayerGetFeatureInfoResponse[]) => {},
  setFeaturesInfosHovered: (
    _featuresInfos: LayerGetFeatureInfoResponse[],
  ) => {},
  setHasDetails: (_hasDetails: boolean) => {},
  setHasGeolocation: (_hasGeolocation: boolean) => {},
  setHasLayerTree: (_hasLayerTree: boolean) => {},
  setHasLnp: (_hasLnp: boolean) => {},
  setHasMapset: (_hasMapset: boolean) => {},
  setHasNotification: (_hasNotification: boolean) => {},
  setHasPermalink: (_hasPermalink: boolean) => {},
  setHasPrint: (_hasPrint: boolean) => {},
  setHasRealtime: (_hasRealtime: boolean) => {},
  setHasSearch: (_hasSearch: boolean) => {},
  setHasShare: (_hasShare: boolean) => {},
  setHasStations: (_hasStations: boolean) => {},
  setHasToolbar: (_hasToolbar: boolean) => {},
  setIsEmbed: (_isEmbed: boolean) => {},
  setIsExportMenuOpen: (_isExportMenuOpen: boolean) => {},
  setIsFollowing: (_isFollowing: boolean) => {},
  setIsLayerTreeOpen: (_isLayerTreeOpen: boolean) => {},
  setIsOverlayOpen: (_isOverlayOpen: boolean) => {},
  setIsSearchOpen: (_isSearchOpen: boolean) => {},
  setIsShareMenuOpen: (_isShareMenuOpen: boolean) => {},
  setIsTracking: (_isTracking: boolean) => {},
  setLinesIds: (_linesIds: string[]) => {},
  setLinesNetworkPlanLayer: (_layer?: MaplibreStyleLayer) => {},
  setMap: (_map?: Map) => {},
  setMapsetLayer: (_mapsetLayer?: MapsetLayer) => {},
  setNotificationId: (_notificationId?: string) => {},
  setNotificationsLayer: (_notificationsLayer?: MocoLayer) => {},
  setNotificationSupportedLanguages: (_langs: string[]) => {},
  setPermalinkUrlSearchParams: (
    _setPermalinkUrlSearchParams: URLSearchParams,
  ) => {},
  setPreviewNotifications: (_setPreviewNotifications?: SituationType[]) => {},
  setRealtimeLayer: (_realtimeLayer?: RealtimeLayer) => {},
  setSelectedFeature: (_feature: Feature) => {},
  setSelectedFeatures: (_features: Feature[]) => {},
  setStation: (_station?: RealtimeStation) => {},
  setStationId: (_stationId?: RealtimeStationId) => {},
  setStationsLayer: (_stationsLayer?: MaplibreStyleLayer) => {},
  setTrainId: (_trainId?: RealtimeTrainId) => {},
};

export const MapContext = createContext<MapContextType>(
  defaultState as MapContextType,
);

const useMapContext = (): MapContextType => {
  const context = useContext<MapContextType>(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
};

export default useMapContext;
