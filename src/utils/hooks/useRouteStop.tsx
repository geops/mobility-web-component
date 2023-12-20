import { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { StopStatus } from "../getStopStatus";

export type RouteStopContextType = {
  station?: RealtimeStation;
  stop?: RealtimeStop & {
    platform?: string;
  };
  status?: StopStatus;
};

export const RouteStopContext = createContext({
  station: null,
  status: null,
  stop: null,
} as RouteStopContextType);

const useRouteStop = (): RouteStopContextType => {
  const context = useContext<RouteStopContextType>(RouteStopContext);
  if (!context) {
    throw new Error("useRouteStop must be used within a ContextProvider");
  }
  return context;
};

export default useRouteStop;
