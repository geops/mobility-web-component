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
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";

import useI18n from "../utils/hooks/useI18n";
import MobilityEvent from "../utils/MobilityEvent";

// @ts-expect-error tailwind must be added for the search web component
import tailwind from "../style.css";

import type { StopsParameters, StopsResponse } from "mobility-toolbox-js/types";
import type { JSX, PreactDOMAttributes } from "preact";

export type StopsFeature = StopsResponse["features"];

export type MobilityStopsSearchProps = {
  apikey: string;
  bbox?: string;
  countrycode?: string;
  event?: string;
  field?: string;
  limit?: number;
  mots?: string;
  onselect?: (arg: StopsFeature) => void;
  params?: string; // JSONstring
  prefagencies?: string;
  reflocation?: string;
  url: string;
} & JSX.HTMLAttributes<HTMLDivElement> &
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
  countrycode,
  event,
  field,
  limit,
  mots,
  onselect,
  params,
  prefagencies,
  reflocation,
  url = "https://api.geops.io/stops/v1/",
}: MobilityStopsSearchProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const [selectedStation, setSelectedStation] = useState<StopsFeature>();
  const [results, setResults] = useState<StopsFeature[] | undefined>();
  const myRef = useRef<HTMLDivElement>();

  useEffect(() => {
    myRef.current?.dispatchEvent(
      new MobilityEvent<MobilityStopsSearchProps>("mwc:attribute", {
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
      <style>{tailwind}</style>
      {/* <div className="relative z-0 rounded-md bg-white" > */}
      <div
        className={
          "flex h-16 items-center gap-4 rounded-md bg-white p-4 pt-3.5 shadow"
        }
        ref={myRef}
      >
        <div className={"flex items-center"}>
          <FaSearch className="size-4" />
        </div>
        <div className={"flex grow overflow-hidden border-b-2 border-solid"}>
          <input
            autoComplete="off"
            className="h-8 flex-1 outline-0 placeholder:text-zinc-400"
            id="searchfield"
            onChange={(evt) => {
              // @ts-expect-error target is missing
              setQuery(evt.target.value);
            }}
            onKeyUp={(evt: JSX.TargetedKeyboardEvent<HTMLInputElement>) => {
              if (evt.key === "Enter") {
                if (results?.length > 0) {
                  setSelectedStation(results[0]);
                }
              }
            }}
            placeholder={t("stops_search_placeholder")}
            type="text"
            value={query}
          />
          {query.length > 0 && (
            <button
              className="flex items-center"
              onClick={() => {
                setQuery("");
                setResults(undefined);
              }}
            >
              <MdClose className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-[-4px] flex grow overflow-auto rounded-md rounded-t-none bg-white shadow">
        {results && results.length === 0 && (
          <div
            className={
              "flex grow gap-3 border border-solid p-3 pt-2 text-zinc-400"
            }
            style={{ border: 1 }}
          >
            <div className="size-6"></div>
            <div>{t("no_stops_found")}</div>
          </div>
        )}
        {results && results.length > 0 && (
          <ul
            className="grow rounded-md rounded-t-none border border-solid bg-white p-0"
            style={{ border: 1 }} // without this th ul is displayed 1 px on the right
          >
            {results?.map((station) => {
              return (
                <li
                  className="border-b border-dashed border-slate-300 p-3 last:border-0"
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
      {/* </div> */}
    </>
  );
}

export default memo(StopsSearch);
