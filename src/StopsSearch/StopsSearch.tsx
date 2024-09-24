import debounce from "lodash.debounce";
import { StopsAPI } from "mobility-toolbox-js/api";
import { StopsResponse } from "mobility-toolbox-js/types";
import { JSX, PreactDOMAttributes } from "preact";
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

import BusPoi from "../icons/BusPoi/BusPoi";
// @ts-expect-error tailwind must be added for the search web component
import tailwind from "../style.css";
import i18n from "../utils/i18n";

export type StationFeature = StopsResponse["features"][0];

export type SearchProps = {
  apikey: string;
  bbox?: string;
  countrycode?: string;
  event?: string;
  field?: string;
  limit?: number;
  mots?: string;
  onselect?: (arg: StationFeature) => void;
  params?: string; // JSONstring
  prefagencies?: string;
  reflocation?: string;
  url: string;
} & JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

const getQueryForSelectedStation = (selectedStation: StationFeature) => {
  return selectedStation.properties.name.toUpperCase();
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
  url,
}: SearchProps) {
  const { t } = i18n;
  const [query, setQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<StationFeature>();
  const [results, setResults] = useState<StopsResponse["features"]>([]);
  const myRef = useRef<HTMLDivElement>();

  const api: StopsAPI = useMemo(() => {
    return new StopsAPI({ apiKey: apikey, url: url });
  }, [apikey, url]);

  const dispatchEvent = useCallback(
    (station?: StationFeature) => {
      const customEvt = new CustomEvent<{ data: StationFeature }>(
        event || "searchstationselect",
        {
          bubbles: true,
          composed: true,
          detail: { data: station },
        },
      );
      if (myRef.current) {
        myRef.current.dispatchEvent(customEvt);
      }
      if (onselect && typeof onselect === "function") {
        onselect(station);
      }
    },
    [event, onselect],
  );

  const debouncedSearch = useMemo(() => {
    let abortCtrl: AbortController;
    return debounce(async (q) => {
      abortCtrl?.abort();
      abortCtrl = new AbortController();
      api
        .search(
          {
            bbox,
            field,
            limit,
            mots,
            prefagencies,
            q,
            ref_location: reflocation,
            ...JSON.parse(params || "{}"),
          },
          { signal: abortCtrl.signal },
        )
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
    setResults([]);

    if (selectedStation) {
      setQuery(getQueryForSelectedStation(selectedStation));
    }

    dispatchEvent(selectedStation);
  }, [dispatchEvent, selectedStation]);

  return (
    <>
      <style>{tailwind}</style>
      <div className="relative z-10 rounded-md bg-white leading-9" ref={myRef}>
        <div className="h-16 rounded-md shadow">
          <div className="flex px-4 pt-3.5">
            <div className="grow overflow-x-auto">
              <div className={"flex grow gap-4"}>
                <div className={"flex items-center "}>
                  <FaSearch className="size-4" />
                </div>
                <div
                  className={
                    "flex grow overflow-hidden border-b-2 border-solid"
                  }
                >
                  <input
                    autoComplete="off"
                    className="h-8 flex-1 outline-0 placeholder:uppercase placeholder:text-zinc-700"
                    id="searchfield"
                    onChange={(event) => {
                      // @ts-expect-error target is missing
                      setQuery(event.target.value);
                    }}
                    onKeyUp={(
                      event: JSX.TargetedKeyboardEvent<HTMLInputElement>,
                    ) => {
                      if (event.key === "Enter") {
                        if (results?.length > 0) {
                          setSelectedStation(results[0]);
                        }
                      }
                    }}
                    placeholder={t("enter_station")}
                    type="text"
                    value={query}
                  />
                  {query.length > 0 && (
                    <button
                      className="flex items-center"
                      onClick={() => {
                        setQuery("");
                      }}
                    >
                      <MdClose className="size-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="pl-8">
                <ul className="max-h-72 overflow-auto rounded-md bg-white shadow">
                  {results.map((station) => {
                    return (
                      <li
                        className="border-b border-dashed border-slate-300 p-3"
                        key={station.properties.uid}
                      >
                        <button
                          className="flex w-full items-center gap-3 text-left"
                          onClick={() => {
                            setSelectedStation(station);
                          }}
                        >
                          <div>
                            <BusPoi className="size-6" />
                          </div>
                          {/* <TrenordTrain className="size-8 pt-0.5" /> */}
                          <div className="grow uppercase">
                            {station.properties.name}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(StopsSearch);
