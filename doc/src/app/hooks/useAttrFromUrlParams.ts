import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const useAttrFromUrlParams = (attributes: string[]) => {
  const searchParams = useSearchParams();

  const attrs = useMemo(() => {
    const values: Record<string, string> = {};
    attributes.forEach((key) => {
      const value = searchParams.get(key);
      if (key && value !== undefined && value !== null) {
        values[key] = value;
      }
    });
    return values;
  }, [attributes, searchParams]);

  return attrs;
};

export default useAttrFromUrlParams;
