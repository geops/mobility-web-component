import { useMemo } from "preact/hooks";

const useDebug = () => {
  const debug = useMemo(() => {
    const value = new URLSearchParams(window.location.search).get("debug");
    return !value || value === "false" ? false : value;
  }, []);
  return debug;
};

export default useDebug;
