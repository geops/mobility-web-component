import { RealtimeStation, RealtimeStop } from "mobility-toolbox-js/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { StopStatus } from "../getStopStatus";

export interface RouteStopContextType {
  index?: number;
  invertColor?: boolean;
  station?: RealtimeStation;
  status?: StopStatus;
  stop?: {
    platform?: string;
  } & RealtimeStop;
}

export const RouteStopContext = createContext({
  index: null,
  invertColor: null,
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
