import debounce from "lodash.debounce";
import { StopsAPI } from "mobility-toolbox-js/api";
import { memo } from "preact/compat";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import { twMerge } from "tailwind-merge";

import Cancel from "../icons/Cancel";
import Search from "../icons/Search";
import IconButton from "../ui/IconButton";
import Input from "../ui/Input";
import useI18n from "../utils/hooks/useI18n";
import MobilityEvent from "../utils/MobilityEvent";

import type { StopsParameters, StopsResponse } from "mobility-toolbox-js/types";
import type {
  HTMLAttributes,
  PreactDOMAttributes,
  TargetedKeyboardEvent,
} from "preact";

import type { StopsFeature } from "../utils/hooks/useSearchStops";

export type StopsSearchProps = {
  apikey: string;
  bbox?: string;
  cancelButtonClassName?: string;
  className?: string;
  countrycode?: string;
  event?: string;
  field?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  lang?: string;
  limit?: number;
  mots?: string;
  onselect?: (arg: StopsFeature) => void;
  params?: string; // JSONstring
  prefagencies?: string;
  reflocation?: string;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  searchIconContainerClassName?: string;
  url: string;
  withResultsClassName?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

const getQueryForSelectedStation = (selectedStation?: StopsFeature): string => {
  return selectedStation?.properties?.name || "";
};

/**
 * Input field to search for stations
 *
 * @fires stationselect
 */
function StopsSearch({
  apikey,
  bbox,
  cancelButtonClassName,
  className,
  countrycode,
  event,
  field,
  inputClassName,
  inputContainerClassName,
  lang,
  limit,
  mots,
  onselect,
  params,
  prefagencies,
  reflocation,
  resultClassName,
  resultsClassName,
  resultsContainerClassName,
  searchIconContainerClassName,
  url = "https://api.geops.io/stops/v1/",
  withResultsClassName,
}: StopsSearchProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<StopsFeature>();
  const [results, setResults] = useState<StopsFeature[] | undefined>();
  const myRef = useRef<HTMLDivElement>();

  useEffect(() => {
    myRef.current?.dispatchEvent(
      new MobilityEvent<StopsSearchProps>("mwc:attribute", {
        apikey,
        bbox,
        countrycode,
        event,
        field,
        lang,
        limit,
        mots,
        onselect,
        params,
        prefagencies,
        reflocation,
        url,
      }),
    );
  }, [
    apikey,
    bbox,
    countrycode,
    event,
    field,
    limit,
    mots,
    onselect,
    params,
    prefagencies,
    reflocation,
    url,
    lang,
  ]);

  const api: StopsAPI = useMemo(() => {
    return new StopsAPI({ apiKey: apikey, url: url });
  }, [apikey, url]);

  const dispatchEvent = useCallback(
    (station?: StopsFeature) => {
      const customEvt = new MobilityEvent<StopsFeature>(
        event || "mwc:stopssearchselect",
        station,
        {
          bubbles: true,
        },
      );

      myRef.current?.dispatchEvent(customEvt);

      if (onselect && typeof onselect === "function") {
        onselect(station);
      }
    },
    [event, onselect],
  );

  const debouncedSearch = useMemo(() => {
    let abortCtrl: AbortController | undefined;

    return debounce((q) => {
      abortCtrl?.abort();
      abortCtrl = new AbortController();

      const reqParams = {
        bbox,
        field,
        limit,
        mots,
        prefagencies,
        q,
        ref_location: reflocation,
        ...JSON.parse(params || "{}"),
      } as StopsParameters;

      api
        .search(reqParams, { signal: abortCtrl.signal })
        .then((res: StopsResponse) => {
          setResults(
            res.features.filter((f) => {
              return !countrycode || f.properties?.country_code === countrycode;
            }),
          );
        })
        .catch((e) => {
          // AbortError is expected
          if (e.code !== 20) {
            // eslint-disable-next-line no-console
            console.error("Failed to fetch stations", e);
            return;
          }
        });
    }, 150);
  }, [
    api,
    bbox,
    countrycode,
    field,
    limit,
    mots,
    params,
    prefagencies,
    reflocation,
  ]);

  useEffect(() => {
    if (
      selectedStation &&
      query === getQueryForSelectedStation(selectedStation)
    ) {
      return;
    }
    if (!query) {
      setSelectedStation(undefined);
      return;
    }
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, selectedStation, debouncedSearch]);

  useEffect(() => {
    setResults(undefined);

    if (selectedStation) {
      setQuery(getQueryForSelectedStation(selectedStation));
    }

    dispatchEvent(selectedStation);
  }, [dispatchEvent, selectedStation]);

  return (
    <>
      <div
        className={twMerge(
          "flex h-16 items-center gap-4 rounded-md bg-white p-4 pt-3.5 shadow",
          className,
          results ? withResultsClassName : "",
        )}
        ref={myRef}
      >
        <div
          className={twMerge(
            "text-grey flex items-center",
            searchIconContainerClassName,
          )}
        >
          <Search />
        </div>
        <div
          className={twMerge(
            "@container/inputsearch flex grow items-center border-b-2 border-solid",
            inputContainerClassName,
          )}
        >
          <Input
            autoComplete="off"
            className={twMerge(
              "h-8 w-1 grow overflow-hidden text-ellipsis placeholder:text-zinc-400",
              inputClassName,
            )}
            onChange={(evt) => {
              // @ts-expect-error target is missing
              setQuery(evt.target.value);
            }}
            onKeyUp={(evt: TargetedKeyboardEvent<HTMLInputElement>) => {
              if (evt.key === "Enter") {
                if (results?.length > 0) {
                  setSelectedStation(results[0]);
                }
              }
            }}
            placeholder={t("stops_search_placeholder")}
            type="text"
            value={query || ""}
          />
          {query.length > 0 && (
            <IconButton
              className={twMerge(
                "flex !size-[32px] items-center rounded-none border-none bg-transparent shadow-none",
                cancelButtonClassName,
              )}
              onClick={() => {
                setQuery("");
                setResults(undefined);
              }}
            >
              <Cancel />
            </IconButton>
          )}
        </div>
      </div>

      {results && (
        <div
          className={twMerge(
            "flex grow overflow-auto rounded-md rounded-t-none bg-white shadow",
            resultsContainerClassName,
          )}
        >
          {!!results?.length && (
            <div
              className={twMerge(
                "flex grow gap-3 border border-solid p-3 pt-2 text-zinc-400",
                resultsClassName,
              )}
              style={{ border: 1 }}
            >
              <div className="size-6"></div>
              <div>{t("no_stops_found")}</div>
            </div>
          )}
          {results && results.length > 0 && (
            <ul
              className={twMerge(
                "grow rounded-md rounded-t-none border border-solid bg-white p-0",
                resultsClassName,
              )}
              style={{ border: 1 }} // without this th ul is displayed 1 px on the right
            >
              {results?.map((station) => {
                return (
                  <li
                    className={twMerge(
                      "border-b border-dashed border-slate-300 p-3 last:border-0",
                      resultClassName,
                    )}
                    key={station.properties.uid}
                  >
                    <button
                      className="flex w-full items-center gap-3 text-left"
                      onClick={() => {
                        setSelectedStation(station);
                      }}
                    >
                      <div className="size-6"></div>
                      <div className="grow">{station.properties.name}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default memo(StopsSearch);
