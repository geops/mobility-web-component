import { useContext } from "preact/hooks";
import { createContext } from "preact";

export const MapContext = createContext(null);

const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a ContextProvider");
  }
  return context;
};

export default useMapContext;
