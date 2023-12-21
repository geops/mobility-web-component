import { useMemo } from "preact/hooks";

const useDebug = () => {
  const debug = useMemo(() => {
    return new URLSearchParams(window.location.search).get("debug") === "true";
  }, []);
  return debug;
};

export default useDebug;
