import { RealtimeDepartureExtended } from "mobility-toolbox-js/types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type DepartureContextType = {
  index?: number;
  departure?: RealtimeDepartureExtended;
};

export const DepartureContext = createContext({
  index: null,
  departure: null,
} as DepartureContextType);

const useDeparture = (): DepartureContextType => {
  const context = useContext<DepartureContextType>(DepartureContext);
  if (!context) {
    throw new Error("useDeparture must be used within a ContextProvider");
  }
  return context;
};

export default useDeparture;
