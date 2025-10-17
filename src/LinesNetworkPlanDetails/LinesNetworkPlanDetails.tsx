import { useMemo, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import RouteIcon from "../RouteIcon";
import ShadowOverflow from "../ShadowOverflow";
import { LNP_LINE_ID_PROP } from "../utils/constants";
import { useLnpLinesInfos, useLnpStopsInfos } from "../utils/hooks/useLnp";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeLine } from "mobility-toolbox-js/types";
import type { Feature } from "ol";
import type { PreactDOMAttributes } from "preact";

import type { LineInfo } from "../utils/hooks/useLnp";

const RUNS_PROP = "runs";

function LinesNetworkPlanDetails({
  className,
  features,
  ...props
}: { className?: string; features: Feature[] } & PreactDOMAttributes) {
  const { linesIds } = useMapContext();
  const lineInfos = useLnpLinesInfos();
  const stopInfos = useLnpStopsInfos();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stopInfosOpenId, setStopInfosOpenId] = useState<string>(null);

  const isRunsDisplay = useMemo(() => {
    return (
      new URLSearchParams(window.location.search).get(RUNS_PROP) === "true"
    );
  }, []);

  const lineInfosByOperator: Record<string, LineInfo[]> = useMemo(() => {
    const byOperators = {};

    [
      ...new Set([
        ...(linesIds || []),
        ...features.map((f) => {
          return f.get(LNP_LINE_ID_PROP);
        }),
      ]),
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
          ?.filter((f) => {
            return f.get(LNP_LINE_ID_PROP) === id;
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
  }, [features, lineInfos, linesIds]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stopInfoIdsByLineId: Record<string, string[]> = useMemo(() => {
    const byLineId = {};
    features.forEach((f) => {
      const lineId = f.get(LNP_LINE_ID_PROP);
      if (lineId && !byLineId[lineId] && f.get("stop_ids")) {
        try {
          byLineId[lineId] = JSON.parse(f.get("stop_ids"));
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Impossible to parse stop_ids", e);
        }
      }
    });

    return byLineId;
  }, [features]);

  if (!features?.length && !linesIds?.length) {
    return null;
  }

  return (
    <ShadowOverflow {...props} className={twMerge("px-4 text-base", className)}>
      <div className="space-y-4">
        {Object.entries(lineInfosByOperator)
          .sort(([operatorNameA], [operatorNameB]) => {
            return lineInfosByOperator[operatorNameA][RUNS_PROP] <
              lineInfosByOperator[operatorNameB][RUNS_PROP]
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
                      let longName = long_name || shortName;

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
                            className={
                              "flex items-center justify-between gap-2"
                            }
                            // onClick={() => {
                            //   setStopInfosOpenId(stopInfosOpenId === id ? null : id);
                            // }}
                          >
                            <div>
                              <RouteIcon line={line}></RouteIcon>
                            </div>
                            {!!longName && (
                              <div className={"flex-1 text-left"}>
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
