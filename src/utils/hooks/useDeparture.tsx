import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { RealtimeDeparture } from "mobility-toolbox-js/types";

export interface DepartureContextType {
  departure?: RealtimeDeparture;
  index?: number;
}

export const DepartureContext = createContext({
  departure: null,
  index: null,
} as DepartureContextType);

const useDeparture = (): DepartureContextType => {
  const context = useContext<DepartureContextType>(DepartureContext);
  if (!context) {
    throw new Error("useDeparture must be used within a ContextProvider");
  }
  return context;
};

export default useDeparture;
