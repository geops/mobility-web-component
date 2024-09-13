import { JSX, PreactDOMAttributes } from "preact";

import useDebug from "../utils/hooks/useDebug";
import useDeparture from "../utils/hooks/useDeparture";

export type DebugDepartureProps = JSX.HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

/**
 * Polyfill for String.prototype.padStart()
 */
const pad = (n: number) => {
  return `0${n}`.slice(-2);
};

const formatDebugTime = (time, excludeSeconds = false) => {
  const d = new Date(time);

  return !time || Number.isNaN(d)
    ? "unknown"
    : [
        pad(d.getHours()),
        pad(d.getMinutes()),
        excludeSeconds ? null : pad(d.getSeconds()),
      ]
        .filter((t) => {
          return t;
        })
        .join(":");
};

function DebugDeparture(props: DebugDepartureProps) {
  const debug = useDebug();
  const { departure } = useDeparture();

  if (!debug) {
    return null;
  }
  const {
    // @ts-expect-error bad type definition
    arrivalTime,
    at_station_ds100: atStationDs100,
    // @ts-expect-error bad type definition
    departureTime,
    fzo_estimated_time: fzoEstimatedTime,
    has_fzo: hasFzo,
    // @ts-expect-error bad type definition
    last_boarding_time: lastBoardingTime,
    min_arrival_time: minArrivalTime,
    ris_aimed_time: risAimedTime,
    ris_estimated_time: risEstimatedTime,
    state,
    // @ts-expect-error bad type definition
    station,
    // @ts-expect-error bad type definition
    stations_in_between: stationsInBetween,
    time,
    train_number: trainNumber,
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
    <div className="border-b p-4 text-left text-xs" {...props}>
      Zugnummer:
      <a href={risLink} rel="noopener noreferrer" target="_blank">
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
