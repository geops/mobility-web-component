import {
  type AffectedTimeIntervalType,
  type PublicationType,
  type TextualContentType,
} from "mobility-toolbox-js/types";
import { twMerge } from "tailwind-merge";

import Warning from "../icons/Warning";
import ShadowOverflow from "../ShadowOverflow";
import Link from "../ui/Link";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";
import useMocoSituation from "../utils/hooks/useMocoSituation";

import type {
  MultilingualTextualContentType,
  RealtimeLine,
  RealtimeMot,
} from "mobility-toolbox-js/types";
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

export type NotificationLine = {
  mot?: RealtimeMot;
  operator_name?: string;
  short_name?: string;
  tags?: string[];
} & RealtimeLine;

function NotificationDetails({
  className,
  ...props
}: {
  className?: string;
  feature: Feature;
}) {
  const { locale, t } = useI18n();
  const { notificationId } = useMapContext();
  const situationParsed = useMocoSituation(notificationId);

  // moco export v2
  let textualContentMultilingual: Partial<MultilingualTextualContentType> = {};
  let textualContent: Partial<TextualContentType> = {};
  let timeIntervalsToDisplay = [];
  let publicationsToDisplay: PublicationType[] = [];
  let reasonsToDisplay: string[] = [];

  // const situationParsed: SituationType = JSON.parse(situation) || {};
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
            textualContentMultilingual =
              textualContentLarge ||
              textualContentMedium ||
              textualContentSmall;

            textualContent = textualContentMultilingual?.[locale()];

            // Fallback to default language if there is not title in the current language
            if (!textualContent?.summary) {
              textualContent = textualContentMultilingual?.de;
            }

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
                <div className={"my-4 flex flex-col gap-4"}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        textualContent?.description ||
                        t("no_details_available"),
                    }}
                  />
                  {!!textualContentMultilingual?.images?.length && (
                    <div className="flex flex-wrap gap-2">
                      {textualContentMultilingual.images.map(
                        ({ image: { absoluteUrl, label } }) => {
                          return (
                            <img
                              alt={label}
                              key={absoluteUrl + label}
                              src={absoluteUrl}
                              title={label}
                            />
                          );
                        },
                      )}
                    </div>
                  )}
                  {!!textualContentMultilingual?.infoLinks?.length && (
                    <div>
                      {textualContentMultilingual.infoLinks.map(
                        ({ label, uri }) => {
                          const title = label[locale()] || label.de || uri;
                          return (
                            <Link href={uri} key={uri} title={title}>
                              {title}
                            </Link>
                          );
                        },
                      )}
                    </div>
                  )}
                  {!!pubLines?.length && (
                    <div>
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
                  {!!stations?.length && (
                    <div>
                      <div className={"font-bold"}>{t("affected_stops")}:</div>
                      <div className={"flex flex-wrap gap-1 text-sm"}>
                        {stations.map((name) => {
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
