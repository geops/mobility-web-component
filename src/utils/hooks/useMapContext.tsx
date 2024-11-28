/* eslint-disable @typescript-eslint/no-empty-function */
import {
  MaplibreLayer,
  MaplibreStyleLayer,
  RealtimeLayer,
} from "mobility-toolbox-js/ol";
import {
  RealtimeStation,
  RealtimeStationId,
  RealtimeStopSequence,
  RealtimeTrainId,
} from "mobility-toolbox-js/types";
import { Map } from "ol";
import { createContext } from "preact";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "preact/hooks";

import type { MobilityMapProps } from "../../MobilityMap/MobilityMap";

export type MapContextType = {
  baseLayer: MaplibreLayer;
  isFollowing: boolean;
  isTracking: boolean;
  map: Map;
  realtimeLayer: RealtimeLayer;
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setIsTracking: (isTracking: boolean) => void;
  setMap: (map?: Map) => void;
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => void;
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
  baseLayer: null,
  isFollowing: false,
  isTracking: false,
  map: null,
  realtimeLayer: null,
  setBaseLayer: (baseLayer?: MaplibreLayer) => {},
  setIsFollowing: (isFollowing: boolean) => {},
  setIsTracking: (isTracking: boolean) => {},
  setMap: (map?: Map) => {},
  setRealtimeLayer: (realtimeLayer?: RealtimeLayer) => {},
  setStation: (station?: RealtimeStation) => {},
  setStationId: (stationId?: RealtimeStationId) => {},
  setStationsLayer: (stationsLayer?: MaplibreStyleLayer) => {},
  setStopSequence: (stopSequence?: RealtimeStopSequence) => {},
  setTrainId: (trainId?: RealtimeTrainId) => {},
  station: null,
  stationId: null,
  stationsLayer: null,
  stopSequence: null,
  trainId: null,
} as MapContextType);

const useMapContext = (): MapContextType => {
  const context = useContext<MapContextType>(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
};

export default useMapContext;
