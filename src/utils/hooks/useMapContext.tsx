import { useContext } from "preact/hooks";
import { createContext } from "preact";
import { MaplibreLayer, RealtimeLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import BaseLayer from "ol/layer/Base";
import { StopSequence } from "mobility-toolbox-js/api/typedefs";

export type MapContextType = {
  apiKey: string;
  baseLayer: MaplibreLayer;
  lineInfos: StopSequence;
  isTracking: boolean;
  isFollowing: boolean;
  map: Map;
  realtimeLayer: RealtimeLayer;
  setBaseLayer: (baseLayer: MaplibreLayer) => void;
  setIsFollowing: (isFollowing: boolean) => void;
  setIsTracking: (isTracking: boolean) => void;
  setLineInfos: (lineInfos?: StopSequence) => void;
  setMap: (map?: Map) => void;
  setRealtimeLayer: (realtimeLayer: RealtimeLayer) => void;
};

export const MapContext = createContext({
  baseLayer: null,
  isFollowing: false,
  isTracking: false,
  lineInfos: null,
  map: null,
  realtimeLayer: null,
  setBaseLayer: (baseLayer: MaplibreLayer) => {},
  setIsFollowing: (isFollowing: boolean) => {},
  setIsTracking: (isTracking: boolean) => {},
  setLineInfos: (lineInfos?: StopSequence) => {},
  setMap: (map?: Map) => {},
  setRealtimeLayer: (realtimeLayer: RealtimeLayer) => {},
});

const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
};

export default useMapContext;
