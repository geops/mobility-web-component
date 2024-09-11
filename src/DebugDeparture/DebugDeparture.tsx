import { PreactDOMAttributes, JSX } from "preact";
import useDebug from "../utils/hooks/useDebug";
import useDeparture from "../utils/hooks/useDeparture";

export type DebugDepartureProps = PreactDOMAttributes &
  JSX.HTMLAttributes<HTMLDivElement>;

/**
 * Polyfill for String.prototype.padStart()
 */
const pad = (n: number) => `0${n}`.slice(-2);

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
    // @ts-expect-error bad type definition
    arrivalTime,
    // @ts-expect-error bad type definition
    departureTime,
    fzo_estimated_time: fzoEstimatedTime,
    ris_aimed_time: risAimedTime,
    ris_estimated_time: risEstimatedTime,
    at_station_ds100: atStationDs100,
    min_arrival_time: minArrivalTime,
    has_fzo: hasFzo,
    // @ts-expect-error bad type definition
    last_boarding_time: lastBoardingTime,
    // @ts-expect-error bad type definition
    stations_in_between: stationsInBetween,
    state,
    // @ts-expect-error bad type definition
    station,
  } = departure;

  const risTime = new Date(risAimedTime);
  const urlDate = Number.isNaN(risTime)
    ? ""
    : [
        (risTime as Date).getFullYear(),
        pad((risTime as Date).getMonth() + 1),
        pad((risTime as Date).getDate()),
      ].join("-");

  const risLink = [
    "https://ris-info.bahn.de/rishttp/risinfo.xml?",
    `action=zuglauf&evanr=${station?.get("uic")}&`,
    `zugnummer=${trainNumber}&`,
    `ankunft=${urlDate}T${formatDebugTime(risTime, true)}`,
  ].join("");

  return (
    <div className="p-4 text-xs text-left border-b" {...props}>
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
        {/* @ts-expect-error bad type definition */}
        {`Has realtime: ${departure.has_realtime_journey};`}
        <br />
        {`Time: ${formatDebugTime(time)};`}
        <br />
        {`Arrival time: ${formatDebugTime(arrivalTime)};`}
        <br />
        {`Departure time: ${formatDebugTime(departureTime)};`}
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
