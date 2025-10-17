import { useEffect, useState } from "preact/hooks";

import { LNP_MD_LINES, LNP_MD_STOPS, LNP_SOURCE_ID } from "../constants";

import useMapContext from "./useMapContext";

import type { VectorTileSource } from "maplibre-gl";

export interface LineInfo {
  color: string;
  external_id: string;
  id: string;
  long_name: string;
  mot: string;
  operator_name: string;
  runs: number;
  short_name: string;
  text_color: string;
}

export interface StopInfo {
  external_id: string;
  importance: number;
  long_name: string;
  short_name: string;
  visibility_level: number;
}

export type LinesInfos = Record<string, LineInfo>;
export type StopsInfos = Record<string, StopInfo>;

let cacheLnpSourceInfo: {
  [LNP_MD_LINES]: LinesInfos;
  [LNP_MD_STOPS]: StopsInfos;
} = null;

export function useLnpSourceInfos() {
  const { baseLayer } = useMapContext();
  const [sourceUrl, setSourceUrl] = useState<string>(null);

  useEffect(() => {
    const url =
      baseLayer?.mapLibreMap?.getSource<VectorTileSource>(LNP_SOURCE_ID)?.url;
    const onSourceData = (e) => {
      if (e.sourceId === LNP_SOURCE_ID && e.isSourceLoaded) {
        setSourceUrl(e.source?.url);
        baseLayer?.mapLibreMap?.off("sourcedata", onSourceData);
      }
    };
    if (!url) {
      baseLayer?.mapLibreMap?.on("sourcedata", onSourceData);
    } else {
      setSourceUrl(url);
    }
    return () => {
      baseLayer?.mapLibreMap?.off("sourcedata", onSourceData);
    };
  }, [baseLayer?.mapLibreMap]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchInfos = async (url: string) => {
      if (!cacheLnpSourceInfo) {
        const response = await fetch(url, { signal: abortController.signal });
        const data = await response.json();
        cacheLnpSourceInfo = data;
      }
    };
    if (sourceUrl) {
      void fetchInfos(sourceUrl);
    }
    return () => {
      abortController?.abort();
    };
  }, [sourceUrl]);

  return cacheLnpSourceInfo;
}

export function useLnpLinesInfos(): LinesInfos {
  const infos = useLnpSourceInfos();
  return infos?.[LNP_MD_LINES];
}

export function useLnpStopsInfos(): StopsInfos {
  const infos = useLnpSourceInfos();
  return infos?.[LNP_MD_STOPS];
}

/**
 * This hook search line informations from lnp data. It takes a string in
 * parameter then it will search if there is a property that exactly match this value.
 */
function useLnpLineInfo(text: string): LineInfo {
  const linesInfos = useLnpLinesInfos();

  if (!linesInfos || !text) {
    return null;
  }

  if (linesInfos[text]) {
    return linesInfos[text];
  }

  return Object.values(linesInfos).find((info) => {
    return ["id", "external_id", "short_name", "long_name"].find((key) => {
      return !!info[key] && info[key] === text;
    });
  });
}

export default useLnpLineInfo;
