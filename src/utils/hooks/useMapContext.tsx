/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type {
  MaplibreLayer,
  MaplibreStyleLayer,
  RealtimeLayer,
} from "mobility-toolbox-js/ol";
import type {
  MocoNotification,
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
} from "mobility-toolbox-js/types";
import type { Feature, Map } from "ol";

import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

export type MapContextType = {
  baseLayer: MaplibreLayer;
  isEmbed: boolean;
  isFollowing: boolean;
  isTracking: boolean;
  map: Map;
  previewNotifications?: MocoNotification[];
  realtimeLayer: RealtimeLayer;
  selectedFeature: Feature;
  selectedFeatures: Feature[];
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setIsTracking: (isTracking: boolean) => void;
  setMap: (map?: Map) => void;
  setPreviewNotifications: (
    setPreviewNotifications?: MocoNotification[],
  ) => void;
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
  isEmbed: false,
  isFollowing: false,
  isTracking: false,
  selectedFeatures: [],
  setBaseLayer: (baseLayer?: MaplibreLayer) => {},
  setIsFollowing: (isFollowing: boolean) => {},
  setIsTracking: (isTracking: boolean) => {},
  setMap: (map?: Map) => {},
  setPreviewNotifications: (previewNotifications?: MocoNotification[]) => {},
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
