import { useEffect, useMemo, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import ShadowOverflow from "../ShadowOverflow";
import useMapContext from "../utils/hooks/useMapContext";

import type { VectorTileSource } from "maplibre-gl";
import type { RealtimeLine } from "mobility-toolbox-js/types";
import type { Feature } from "ol";
import type { PreactDOMAttributes } from "preact";

let cacheLineInfosById = null;
let cacheStopInfosById = null;

interface LineInfo {
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

interface StopInfo {
  external_id: string;
  importance: number;
  long_name: string;
  short_name: string;
  visibility_level: number;
}

const LNP_SOURCE_ID = "network_plans";
const LNP_MD_LINES = "geops.lnp.lines";
const LNP_MD_STOPS = "geops.lnp.stops";
const RUNS_PROP = "runs";
const ORIGINAL_LINE_ID_PROP = "original_line_id";

function LinesNetworkPlanDetails({
  className,
  features,
  ...props
}: { className?: string; features: Feature[] } & PreactDOMAttributes) {
  const { baseLayer } = useMapContext();
  const [lineInfos, setLineInfos] = useState<LineInfo[]>(null);
  const [stopInfos, setStopInfos] = useState<StopInfo[]>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stopInfosOpenId, setStopInfosOpenId] = useState<string>(null);

  const isRunsDisplay = useMemo(() => {
    return new URLSearchParams(window.location.search).get("runs") === "true";
  }, []);

  useEffect(() => {
    const source = baseLayer?.mapLibreMap?.getSource(LNP_SOURCE_ID);
    const abortController = new AbortController();
    const fetchInfos = async (url) => {
      if (!cacheLineInfosById) {
        const response = await fetch(url, { signal: abortController.signal });
        const data = await response.json();
        cacheLineInfosById = data[LNP_MD_LINES];
        cacheStopInfosById = data[LNP_MD_STOPS];
      }
      setLineInfos(cacheLineInfosById);
      setStopInfos(cacheStopInfosById);
    };
    const url = (source as VectorTileSource)?.url;
    if (url) {
      void fetchInfos(url);
    }
    return () => {
      abortController?.abort();
    };
  }, [baseLayer?.mapLibreMap]);

  const lineInfosByOperator: Record<string, LineInfo[]> = useMemo(() => {
    const byOperators = {};

    [
      ...new Set(
        features.map((f) => {
          return f.get(ORIGINAL_LINE_ID_PROP);
        }),
      ),
    ]
      .filter((id) => {
        return !!id && !!lineInfos?.[id];
      })
      .forEach((id) => {
        const { operator_name: operatorName } = lineInfos[id];
        if (!byOperators[operatorName]) {
          byOperators[operatorName] = [];
          byOperators[operatorName].runs = 0;
        }
        lineInfos[id].id = id;

        const runs = features
          .filter((f) => {
            return f.get(ORIGINAL_LINE_ID_PROP) === id;
          })
          .reduce((acc, featuree) => {
            return acc + featuree.get(RUNS_PROP);
          }, 0);
        lineInfos[id].id = id;
        lineInfos[id].runs = runs;
        byOperators[operatorName].runs += runs;
        byOperators[operatorName].push(lineInfos[id]);
      });

    return byOperators;
  }, [features, lineInfos]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stopInfoIdsByLineId: Record<string, string[]> = useMemo(() => {
    const byLineId = {};
    features.forEach((f) => {
      const lineId = f.get(ORIGINAL_LINE_ID_PROP);
      if (lineId && !byLineId[lineId] && f.get("stop_ids")) {
        try {
          byLineId[lineId] = JSON.parse(f.get("stop_ids"));
        } catch (e) {
          console.log(e);
        }
      }
    });

    return byLineId;
  }, [features]);

  if (!features?.length) {
    return null;
  }

  return (
    <ShadowOverflow {...props} className={twMerge("px-4 text-base", className)}>
      <div className="space-y-4">
        {Object.entries(lineInfosByOperator)
          .sort(([operatorNameA], [operatorNameB]) => {
            return lineInfosByOperator[operatorNameA].runs <
              lineInfosByOperator[operatorNameB].runs
              ? 1
              : -1;
          })
          .map(([operatorName, linesInfos]) => {
            return (
              <div className={"flex flex-col gap-2"} key={operatorName}>
                <div>{operatorName}</div>
                <div className="flex flex-wrap gap-2">
                  {linesInfos
                    .sort((a, b) => {
                      return a.runs < b.runs ? 1 : -1;
                    })
                    .map((lineInfo) => {
                      const {
                        color: backgroundColor,
                        // color,
                        // external_id,
                        long_name,
                        mot,
                        runs,
                        short_name: shortName,
                        text_color: textColor,
                      } = lineInfo;
                      let longName = long_name;

                      let stops = null;
                      //stopInfoIdsByLineId?.[id] || null;
                      if (!stops?.length) {
                        stops = null;
                      }

                      if (!longName && stops) {
                        const names = stops.map((stopId) => {
                          return stopInfos[stopId].short_name;
                        });

                        longName = [
                          ...new Set([names[0], names[names.length - 1]]),
                        ].join(" - ");
                      }

                      // Build a line object
                      const line: { type: string } & RealtimeLine = {
                        color: null,
                        id: null,
                        name: shortName,
                        stroke: null,
                        text_color: null,
                        type: mot,
                      };

                      if (textColor) {
                        line.text_color = textColor.startsWith("#")
                          ? textColor
                          : `#${textColor}`;
                      }

                      if (backgroundColor) {
                        line.color = backgroundColor.startsWith("#")
                          ? backgroundColor
                          : `#${backgroundColor}`;
                      }

                      return (
                        <div
                          className={longName ? "w-full" : ""}
                          key={shortName}
                        >
                          <div
                            className={"flex justify-between gap-2"}
                            // onClick={() => {
                            //   setStopInfosOpenId(stopInfosOpenId === id ? null : id);
                            // }}
                          >
                            <div>
                              <RouteIcon line={line}></RouteIcon>
                            </div>
                            {!!longName && (
                              <div
                                className={
                                  "flex-1 text-left *:before:content-['_–'] *:first:font-semibold *:first:before:!content-[_p] *:last:font-semibold *:last:before:!content-[_p]"
                                }
                              >
                                {longName.split("-").map((name) => {
                                  return <div key={name}>{name}</div>;
                                })}
                              </div>
                            )}
                            {isRunsDisplay && (
                              <div className={"text-xs"}>{runs}</div>
                            )}

                            {/* We deactivate the list of stopsfor now */}
                            {/* {!!stops && (
                              <button className={"shrink-0"}>
                                {stopInfosOpenId === id ? (
                                  <ArrowUp />
                                ) : (
                                  <ArrowDown />
                                )}
                              </button>
                            )} */}
                          </div>
                          {/* {!!stops && (
                            <div
                              className={`${stopInfosOpenId === id ? "" : "hidden"}`}
                            >
                              {stops?.map((stopId, index, arr) => {
                                const stop = stopInfos[stopId];
                                return (
                                  <div
                                    className={"flex items-center gap-2"}
                                    key={stopId}
                                  >
                                    <RouteStopContext.Provider
                                      value={{
                                        index,
                                        status: {
                                          isFirst: !index,
                                          isLast: index === arr.length - 1,
                                          isLeft: false,
                                          isPassed: false,
                                          progress: !index ? 50 : 0,
                                        },
                                        stop,
                                      }}
                                    >
                                      <RouteStopProgress
                                        className="relative flex size-8 shrink-0 items-center justify-center"
                                        lineColor={line.color}
                                      />
                                      <div>{stop.short_name}</div>
                                    </RouteStopContext.Provider>
                                  </div>
                                );
                              })}
                            </div>
                          )} */}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
      </div>
    </ShadowOverflow>
  );
}

export default LinesNetworkPlanDetails;
