import {
  type AffectedTimeIntervalType,
  type PublicationType,
  type SituationType,
  type TextualContentType,
} from "mobility-toolbox-js/types";
import { useEffect, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import Warning from "../icons/Warning";
import ShadowOverflow from "../ShadowOverflow";
import getBgColor from "../utils/getBgColor";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { RealtimeLine, RealtimeMot } from "mobility-toolbox-js/types";
import type { Feature } from "ol";

const toShortDate = (date: Date, showTime, showYear?: boolean) => {
  const time = date.toLocaleTimeString(["de"], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = date.toLocaleDateString(["de"], {
    day: "2-digit",
    month: "short",
    weekday: "short",
    year: showYear ? "numeric" : undefined,
  });

  return `${dateString}${showTime && showTime !== time ? ` ${time}` : ""}`
    .replace(",", "")
    .replace(/\./, "")
    .replace(/\.$/, "");
};

const getLine = (name: string, lines: NotificationLine[]): NotificationLine => {
  if (lines?.length) {
    const line = lines.find((linee) => {
      return linee.name === name;
    });
    if (line) {
      return line;
    }
  }
  return { mot: "bus", name } as NotificationLine;
};

export type NotificationLine = {
  mot?: RealtimeMot;
  operator_name?: string;
  short_name?: string;
  tags?: string[];
} & RealtimeLine;

function NotificationDetails({
  className,
  feature,
  ...props
}: {
  className?: string;
  feature: Feature;
}) {
  const { t } = useI18n();
  const { notificationtenant } = useMapContext();
  const [lines, setLines] = useState<NotificationLine[]>([]);
  const {
    affected_products: affectedProducts,
    affected_time_intervals: timeIntervals,
    consequence_de: consequence,
    description_de: descriptionDe,
    // title,
    disruption_type: disruptionType,
    // disruption_type: disruptionType,
    // duration_text_de: durationText,
    // links,
    // long_description: description,
    reason_de: reason,
    recommendation_de: recommendation,
    situation,
    summary_de: summary,
  } = feature.getProperties();

  useEffect(() => {
    const abortController = new AbortController();
    if (!notificationtenant) {
      setLines([]);
    }
    fetch(
      `https://tralis-tracker-api.geops.io/api/lines/${notificationtenant}/`,
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLines(data);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch lines", err);
      });
    return () => {
      abortController?.abort();
    };
  }, [notificationtenant]);

  // "title_de": "",
  //           "title_fr": "",
  //           "title_it": "",
  //           "title_en": "",
  //           "summary_de": "",
  //           "summary_fr": "",
  //           "summary_it": "",
  //           "summary_en": "",
  //           "reason_de": "Baustelle",
  //           "reason_fr": "",
  //           "reason_it": "",
  //           "reason_en": "",
  //           "description_de": "",
  //           "description_fr": "",
  //           "description_it": "",
  //           "description_en": "",
  //           "consequence_de": "Umleitung",
  //           "consequence_fr": "",
  //           "consequence_it": "",
  //           "consequence_en": "",
  //           "duration_text_de": "",
  //           "duration_text_fr": "",
  //           "duration_text_it": "",
  //           "duration_text_en": "",
  //           "recommendation_de": "",
  //           "recommendation_fr": "",
  //           "recommendation_it": "",
  //           "recommendation_en": "",
  //           "reasons": [
  //               "Ausfall des Aufzuges"
  //           ]

  let end = "",
    start = "";
  let products = [];
  // let externalLinks = [];

  try {
    const timeInterval = JSON.parse(timeIntervals)?.[0] || {};
    start = timeInterval.start;
    end = timeInterval.end;
    // const dateStart = new Date(timeInterval.start);
    // start =
    //   dateStart.toLocaleDateString() + " " + dateStart.toLocaleTimeString();
    // const dateEnd = new Date(timeInterval.end);
    // console.log("dateEnd", dateEnd);
    // end = dateEnd.toLocaleDateString() + " " + dateEnd.toLocaleTimeString();

    products = JSON.parse(affectedProducts);
    products?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    // externalLinks = JSON.parse(links);
  } catch (e) {
    console.error(e);
  }

  // moco export v1
  if (disruptionType) {
    return (
      // <div className={"flex gap-2 text-sm"}>
      //   <div className="min-w-8 shrink-0 grow-0">
      //     <img
      //       alt={disruptionType}
      //       className={"w-8"}
      //       src={icons[disruptionType]}
      //     ></img>
      //   </div>
      <div className={"flex flex-col gap-2 text-sm"}>
        {/* <div className="text-base font-bold">{title}</div> */}
        {!!products?.length && (
          <div className="flex flex-wrap gap-2">
            {products?.map(({ name }) => {
              const line = getLine(name, lines);
              return (
                <>
                  <div
                    className={
                      "w-fit rounded-md bg-black px-[12px] py-[9px] leading-none font-bold text-white"
                    }
                    key={name}
                    style={{
                      backgroundColor: getBgColor(line.mot, line),
                    }}
                  >
                    {name}
                  </div>
                </>
              );
            })}
          </div>
        )}
        <div className="text-base font-bold">
          {!!start && !end && `ab${toShortDate(new Date(start), true)}`}
          {!start && !!end && `bis${toShortDate(new Date(end), true)}`}
          {!!start &&
            !!end &&
            `${toShortDate(new Date(start), true)} - ${toShortDate(new Date(end), true)}`}
        </div>
        <div className={"flex flex-col gap-2"}>
          <p className={"text-base"}>{summary}</p>
          <p className={"text-base"}>{descriptionDe}</p>

          {[
            {
              content: recommendation,
              label: "recommendation",
            },
            {
              content: reason,
              label: "reason",
            },
            {
              content: consequence,
              label: "consequence",
            },
          ].map((item) => {
            if (!item.content) {
              return null;
            }
            return (
              <div key={item.content}>
                {!!item.label && <p className="font-bold">{t(item.label)}:</p>}
                <p>{item.content}</p>
              </div>
            );
          })}
        </div>
      </div>
      // </div>
      // <div className={"flex flex-col gap-4 text-sm"}>
      //   <div>
      //     <div className="text-base font-bold">{title}</div>
      //     <div className="text-xs">
      //       {start} - {end}
      //     </div>
      //   </div>
      //   <div
      //     className={"flex flex-col gap-2"}
      //     dangerouslySetInnerHTML={{
      //       __html: converter.makeHtml(description).replace("<hr />", "<br />"),
      //     }}
      //   ></div>
      //   {externalLinks?.map(({ label_de: label, uri }) => {
      //     return (
      //       <RvfLink href={uri} key={uri}>
      //         {label}
      //       </RvfLink>
      //     );
      //   })}
      // {!!products?.length && (
      //   <>
      // <div className={"font-bold"}>Betroffene Lines:</div>
      // <div className={"flex flex-wrap gap-1"}>
      //   {products?.map(({ name }) => {
      //     return (
      //       <div
      //         className={
      //           "rounded-md bg-red px-[12px] py-[9px] font-bold leading-none text-white"
      //         }
      //         key={name}
      //       >
      //         {name}
      //       </div>
      //     );
      //   })}
      // </div>
      //   </>
      // )}
      // </div>
    );
  }

  // moco export v2
  let textualContent: Partial<TextualContentType> = {};
  let timeIntervalsToDisplay = [];
  let publicationsToDisplay: PublicationType[] = [];
  let reasonsToDisplay: string[] = [];

  try {
    const situationParsed: SituationType = JSON.parse(situation) || {};
    const publicationsArr: PublicationType[] =
      situationParsed?.publications || [];

    // Find the current publication(s) at the current date
    publicationsToDisplay =
      publicationsArr?.filter(({ publicationWindows }) => {
        return publicationWindows.find(({ endTime, startTime }) => {
          const now = new Date();
          const startT = new Date(startTime);
          const endT = new Date(endTime);
          return startT <= now && now <= endT;
        });
      }) || [];

    // Display the current and next affected time intervals not the one in the past
    timeIntervalsToDisplay =
      (situationParsed?.affectedTimeIntervals || []).filter(
        ({ endTime, startTime }) => {
          const now = new Date();
          const startT = new Date(startTime);
          const endT = new Date(endTime);
          return (startT <= now && now <= endT) || now < startT;
        },
      ) || [];

    // Display the reasons
    reasonsToDisplay = (situationParsed?.reasons || []).map(({ name }) => {
      return name;
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse publications", e);
  }

  return (
    <ShadowOverflow {...props} className={twMerge("px-4 text-base", className)}>
      <div>
        {publicationsToDisplay?.map(
          ({
            id,
            publicationLines,
            publicationStops,
            textualContentLarge,
            textualContentMedium,
            textualContentSmall,
          }) => {
            // Get the textual content in German
            textualContent = (
              textualContentLarge ||
              textualContentMedium ||
              textualContentSmall
            )?.de;

            const pubLines =
              publicationLines?.flatMap((publication) => {
                return (
                  publication.lines?.map(({ name }) => {
                    return name;
                  }) || []
                );
              }) || [];

            const stations = publicationStops.map((publication) => {
              return publication?.name || "";
            });

            return (
              <div className={"text-base"} key={id}>
                <div className="text-xs uppercase">{reasonsToDisplay}</div>
                <h3 className="space-x-2 text-lg font-bold text-balance">
                  <span
                    className={"line-height-[1.3] inline-block align-middle"}
                  >
                    <Warning />
                  </span>
                  <span
                    className={"*:inline"}
                    dangerouslySetInnerHTML={{
                      __html: textualContent?.summary,
                    }}
                  ></span>
                </h3>
                <hr className="my-1" />

                {timeIntervalsToDisplay?.map(
                  ({
                    dailyEndTime,
                    dailyStartTime,
                    endTime,
                    startTime,
                  }: AffectedTimeIntervalType) => {
                    const hasDailyTime = dailyEndTime && dailyStartTime;
                    const isStartCurrentYear =
                      new Date().getFullYear() ===
                      new Date(startTime).getFullYear();
                    const isEndCurrentYear =
                      new Date().getFullYear() ===
                      new Date(endTime).getFullYear();
                    const isEndInfinite = endTime.includes("2500");

                    return (
                      <div
                        className="text-sm font-bold text-balance"
                        key={startTime}
                      >
                        <span>
                          {t("from_to", {
                            from: toShortDate(
                              new Date(startTime),
                              !hasDailyTime,
                              !isStartCurrentYear,
                            ),
                            to: !isEndInfinite
                              ? toShortDate(
                                  new Date(endTime),
                                  !hasDailyTime,
                                  !isEndCurrentYear,
                                )
                              : undefined,
                          })}
                        </span>
                        {hasDailyTime && (
                          <span>{` (${t("daily_from_to", {
                            from: dailyStartTime,
                            to: dailyEndTime,
                          })})`}</span>
                        )}
                      </div>
                    );
                  },
                )}
                <div
                  className="mt-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      textualContent?.description || t("no_details_available"),
                  }}
                />
                {!!pubLines?.length && (
                  <div>
                    <br />
                    <div className={"font-bold"}>{t("affected_lines")}:</div>
                    <div className={"flex flex-wrap gap-1 text-sm"}>
                      {pubLines?.map((name) => {
                        return (
                          <div
                            className={
                              "rounded-md bg-black px-2 py-1 font-bold text-white"
                            }
                            key={name}
                          >
                            {name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <br />
                  <div className={"font-bold"}>{t("affected_stops")}:</div>
                  <div className={"flex flex-wrap gap-1 text-sm"}>
                    {stations?.length ? (
                      stations.map((name) => {
                        return (
                          <div
                            className={
                              "rounded-md bg-black px-2 py-1 font-bold text-white"
                            }
                            key={name}
                          >
                            {name}
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className={
                          "rounded-md bg-black px-2 py-1 font-bold text-white"
                        }
                      >
                        {t("all_line_stops")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </ShadowOverflow>
  );
}

export default NotificationDetails;
