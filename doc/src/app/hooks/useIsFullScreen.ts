import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useIsFullScreen = () => {
  const searchParams = useSearchParams();

  const isFullScreen = useMemo(() => {
    return searchParams.get("fullscreen") === "true";
  }, [searchParams]);

  return isFullScreen;
};

export default useIsFullScreen;
