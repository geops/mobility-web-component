import { RealtimeStation } from "mobility-toolbox-js/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface StationContextType {
  station?: RealtimeStation;
}

export const StationContext = createContext({
  station: null,
} as StationContextType);

const useRouteStop = (): StationContextType => {
  const context = useContext<StationContextType>(StationContext);
  if (!context) {
    throw new Error("useRouteStop must be used within a ContextProvider");
  }
  return context;
};

export default useRouteStop;
