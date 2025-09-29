/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type {
  MaplibreLayer,
  MaplibreStyleLayer,
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
  baseLayer: MaplibreLayer;
  featuresInfos: LayerGetFeatureInfoResponse[];
  featuresInfosHovered: LayerGetFeatureInfoResponse[];
  hasDetails: boolean;
  hasGeolocation: boolean;
  hasLayerTree: boolean;
  hasLnp: boolean;
  hasNotification: boolean;
  hasPermalink: boolean;
  hasPrint: boolean;
  hasRealtime: boolean;
  hasSearch: boolean;
  hasShare: boolean;
  hasStations: boolean;
  hasToolbar: boolean;
  isEmbed: boolean;
  isExportMenuOpen: boolean;
  isFollowing: boolean;
  isLayerTreeOpen: boolean;
  isOverlayOpen: boolean;
  isSearchOpen: boolean;
  isShareMenuOpen: boolean;
  isTracking: boolean;
  linesNetworkPlanLayer: MaplibreStyleLayer;
  map: Map;
  permalinkUrlSearchParams: URLSearchParams;
  previewNotifications?: SituationType[];
  realtimeLayer: RealtimeLayer;
  selectedFeature: Feature;
  selectedFeatures: Feature[];
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setFeaturesInfos: (featuresInfos: LayerGetFeatureInfoResponse[]) => void;
  setFeaturesInfosHovered: (
    featuresInfos: LayerGetFeatureInfoResponse[],
  ) => void;
  setHasDetails: (hasDetails: boolean) => void;
  setHasGeolocation: (hasGeolocation: boolean) => void;
  setHasLayerTree: (hasLayerTree: boolean) => void;
  setHasLnp: (hasLnp: boolean) => void;
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
  setLinesNetworkPlanLayer: (layer?: MaplibreStyleLayer) => void;
  setMap: (map?: Map) => void;
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
  setStopSequence: (stopSequence?: RealtimeStopSequence) => void;
  setTrainId: (trainId?: RealtimeTrainId) => void;
  station: RealtimeStation;
  stationId: RealtimeStationId;
  stationsLayer: MaplibreStyleLayer;
  stopSequence: RealtimeStopSequence;
  trainId: RealtimeTrainId;
} & MobilityMapProps;

export const MapContext = createContext<MapContextType>({
  hasDetails: false,
  hasGeolocation: false,
  hasLayerTree: false,
  hasLnp: false,
  hasNotification: false,
  hasPermalink: false,
  hasPrint: false,
  hasRealtime: false,
  hasSearch: false,
  hasShare: false,
  hasStations: false,
  hasToolbar: true,
  isEmbed: false,
  isExportMenuOpen: false,
  isFollowing: false,
  isLayerTreeOpen: false,
  isOverlayOpen: false,
  isSearchOpen: false,
  isShareMenuOpen: false,
  isTracking: false,
  selectedFeatures: [],
  setBaseLayer: (baseLayer?: MaplibreLayer) => {},
  setIsFollowing: (isFollowing: boolean) => {},
  setIsTracking: (isTracking: boolean) => {},
  setMap: (map?: Map) => {},
  setPermalinkUrlSearchParams: (
    permalinkUrlSearchParams: URLSearchParams,
  ) => {},
  setPreviewNotifications: (previewNotifications?: SituationType[]) => {},
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => {},
  setSelectedFeature: (feature: Feature) => {},
  setSelectedFeatures: (features: Feature[]) => {},
  setStation: (station?: RealtimeStation) => {},
  setStationId: (stationId?: RealtimeStationId) => {},
  setStationsLayer: (stationsLayer?: MaplibreStyleLayer) => {},
  setStopSequence: (stopSequence?: RealtimeStopSequence) => {},
  setTrainId: (trainId?: RealtimeTrainId) => {},
} as MapContextType);

const useMapContext = (): MapContextType => {
  const context = useContext<MapContextType>(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
};

export default useMapContext;
