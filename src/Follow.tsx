import { RealtimeTrajectory } from "mobility-toolbox-js/types";
import { useEffect, useState } from "preact/hooks";
import type { Map } from "ol";
import { unByKey } from "ol/Observable";
import { realtimeConfig } from "mobility-toolbox-js/ol";

function Follow({ map, lineInfos, trackerLayer, onFollow }) {
  const [isTracking, setIsTracking] = useState(false);

  const {
    type,
    vehicleType,
    shortName,
    longName,
    stroke,
    destination,
    text_color: textColor,
  } = lineInfos;

  useEffect(() => {
    let interval = null;

    trackerLayer.allowRenderWhenAnimating = !!isTracking;
    if (!isTracking) {
      return;
    }

    const trainId = lineInfos.id;
    const vehicle = trainId && trackerLayer.trajectories?.[trainId];

    if (!vehicle) {
      console.warn("No vehicle found:", lineInfos);
      setIsTracking(false);
      return;
    }

    const onMovestartKey = map.getView().on("change:center", (evt) => {
      if (evt.target.getInteracting()) {
        setIsTracking(false);
      }
    });

    onFollow(vehicle, true);
    interval = setInterval(() => {
      const trainId = lineInfos.id;
      const vehicle = trainId && trackerLayer.trajectories?.[trainId];

      if (!vehicle) {
        console.warn("No vehicle found:", lineInfos);
        setIsTracking(false);
        return;
      }

      onFollow(vehicle);
    }, 1000);

    return () => {
      unByKey(onMovestartKey);
      clearInterval(interval);
    };
  }, [isTracking, map, trackerLayer, lineInfos, onFollow]);

  return (
    <button
      className={`flex bg-white shadow-lg rounded-full p-1 w-[40px] h-[40px] items-center justify-center ${
        isTracking ? "animate-pulse" : ""
      }`}
      style={{
        /* stylelint-disable-next-line value-keyword-case */
        backgroundColor: isTracking
          ? stroke || realtimeConfig.getBgColor(type || vehicleType)
          : "white",
        color: isTracking ? textColor : "black",
      }}
      onClick={() => {
        setIsTracking(!isTracking);
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        part="svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="currentColor"
          d="M7 0.333344C7.375 0.333344 7.66667 0.62501 7.66667 0.97921V2.35414C9.7292 2.66668 11.3333 4.27081 11.625 6.33334H13C13.375 6.33334 13.6667 6.62501 13.6667 7.00001C13.6667 7.37501 13.375 7.66668 13 7.66668H11.625C11.3333 9.70834 9.70833 11.3333 7.66667 11.625V13C7.66667 13.375 7.375 13.6667 7 13.6667C6.64587 13.6667 6.33333 13.375 6.33333 13V11.625C4.29167 11.3333 2.68747 9.70834 2.39587 7.66668H1C0.625 7.66668 0.333333 7.37501 0.333333 7.00001C0.333333 6.62501 0.625 6.33334 1 6.33334H2.39587C2.68747 4.27081 4.29167 2.66668 6.33333 2.35414V0.97921C6.33333 0.62501 6.64587 0.333344 7 0.333344ZM7 3.66668C5.16667 3.66668 3.66667 5.16668 3.66667 7.00001C3.66667 8.79168 5.08333 10.3125 7 10.3125C8.89587 10.3125 10.3333 8.81254 10.3333 7.00001C10.3333 5.16668 8.83333 3.66668 7 3.66668Z"
        />
        <path
          part="circle"
          fill-rule="evenodd"
          clip-rule="evenodd"
          fill="currentColor"
          d="M5.66667 7.00001C5.66667 6.27081 6.2708 5.66668 7 5.66668C7.7292 5.66668 8.33333 6.27081 8.33333 7.00001C8.33333 7.72921 7.7292 8.33334 7 8.33334C6.2708 8.33334 5.66667 7.72921 5.66667 7.00001Z"
        ></path>
      </svg>
    </button>
  );
}

export default Follow;
