/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "preact/hooks";
import { createContext } from "preact";
import { MaplibreLayer, RealtimeLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { StopSequence } from "mobility-toolbox-js/api/typedefs";
import { RealtimeTrainId } from "mobility-toolbox-js/types";
import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

export type MapContextType = MobilityMapProps & {
  stopSequence: StopSequence;
  isTracking: boolean;
  isFollowing: boolean;
  map: Map;
  baseLayer: MaplibreLayer;
  realtimeLayer: RealtimeLayer;
  trainId: RealtimeTrainId;
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setIsTracking: (isTracking: boolean) => void;
  setStopSequence: (stopSequence?: StopSequence) => void;
  setMap: (map?: Map) => void;
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => void;
  setTrainId: (trainId?: RealtimeTrainId) => void;
};

export const MapContext = createContext<MapContextType>({
  baseLayer: null,
  isFollowing: false,
  isTracking: false,
  stopSequence: null,
  map: null,
  realtimeLayer: null,
  trainId: null,
  setBaseLayer: (baseLayer?: MaplibreLayer) => {},
  setIsFollowing: (isFollowing: boolean) => {},
  setIsTracking: (isTracking: boolean) => {},
  setMap: (map?: Map) => {},
  setStopSequence: (stopSequence?: StopSequence) => {},
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => {},
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
