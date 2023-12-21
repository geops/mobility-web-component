import { PreactDOMAttributes, JSX } from "preact";
import useDebug from "../utils/hooks/useDebug";
import useDeparture from "../utils/hooks/useDeparture";

export type DebugDepartureProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

/**
 * Polyfill for String.prototype.padStart()
 */
const pad = (n) => `0${n}`.slice(-2);

const formatDebugTime = (time, excludeSeconds = false) => {
  const d = new Date(time);

  return !time || Number.isNaN(d)
    ? "unknown"
    : [
        pad(d.getHours()),
        pad(d.getMinutes()),
        excludeSeconds ? null : pad(d.getSeconds()),
      ]
        .filter((t) => t)
        .join(":");
};

function DebugDeparture(props: DebugDepartureProps) {
  const debug = useDebug();
  const { departure } = useDeparture();

  if (!debug) {
    return null;
  }
  const {
    train_number: trainNumber,
    time,
    fzo_estimated_time: fzoEstimatedTime,
    ris_aimed_time: risAimedTime,
    ris_estimated_time: risEstimatedTime,
    at_station_ds100: atStationDs100,
    min_arrival_time: minArrivalTime,
    has_fzo: hasFzo,
    last_boarding_time: lastBoardingTime,
    stations_in_between: stationsInBetween,
    state,
    station,
  } = departure;

  const risTime = new Date(risAimedTime) || "";
  const urlDate = Number.isNaN(risTime)
    ? ""
    : [
        risTime.getFullYear(),
        pad(risTime.getMonth() + 1),
        pad(risTime.getDate()),
      ].join("-");

  const risLink = [
    "https://ris-info.bahn.de/rishttp/risinfo.xml?",
    `action=zuglauf&evanr=${station?.get("uic")}&`,
    `zugnummer=${trainNumber}&`,
    `ankunft=${urlDate}T${formatDebugTime(risTime, true)}`,
  ].join("");

  return (
    <div className="pl-4 pr-4 pb-4 text-xs text-left" {...props}>
      Zugnummer:
      <a href={risLink} target="_blank" rel="noopener noreferrer">
        {trainNumber}
      </a>
      <div>
        {`  State: `}
        <b>{state}</b>
        <br />
        {`Has fzo: ${hasFzo};`}
        <br />
        {/* @ts-ignore */}
        {`Has realtime: ${departure.has_realtime_journey};`}
        <br />
        {`Time used: ${formatDebugTime(time)};`}
        <br />
        {`FzO-Estimated: ${formatDebugTime(fzoEstimatedTime)};`}
        <br />
        {`RIS-Aimed: ${formatDebugTime(risAimedTime)};`}
        <br />
        {`RIS-Estimated: ${formatDebugTime(risEstimatedTime)};`}
        <br />
        {`Ref-Location: ${atStationDs100};`}
        <br />
        {`Normalized Distance: ${formatDebugTime(minArrivalTime)};`}
        <br />
        {`Last Boarding: ${formatDebugTime(lastBoardingTime)};`}
        <br />
        {`Stationen until arrival: ${stationsInBetween};`}
      </div>
    </div>
  );
}

export default DebugDeparture;
