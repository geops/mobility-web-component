import { memo } from "preact/compat";

import RouteIcon from "../RouteIcon";
import RouteInfos from "../RouteInfos";
import getBgColor from "../utils/getBgColor";
import useMapContext from "../utils/hooks/useMapContext";

function RouteScheduleHeader() {
  const { isFollowing, setIsFollowing, stopSequence } = useMapContext();
  const { stroke, text_color: textColor, type, vehicleType } = stopSequence;
  const backgroundColor = stroke || getBgColor(type || vehicleType);
  const color = textColor || "black";
  return (
    <div className="flex items-center gap-x-4 bg-slate-100 p-4">
      <RouteIcon stopSequence={stopSequence} />
      <RouteInfos className="flex grow flex-col" stopSequence={stopSequence} />
      <button
        className={`flex size-[38px] flex-none items-center justify-center rounded-full bg-white p-1.5 shadow-lg ${
          isFollowing ? "animate-pulse" : ""
        }`}
        onClick={() => {
          setIsFollowing(!isFollowing);
        }}
        style={{
          /* stylelint-disable-next-line value-keyword-case */
          backgroundColor: isFollowing ? backgroundColor : "white",
          color: isFollowing ? color : "black",
        }}
        type="button"
      >
        <svg
          fill="none"
          height="24"
          part="svg"
          viewBox="0 0 14 14"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            d="M7 0.333344C7.375 0.333344 7.66667 0.62501 7.66667 0.97921V2.35414C9.7292 2.66668 11.3333 4.27081 11.625 6.33334H13C13.375 6.33334 13.6667 6.62501 13.6667 7.00001C13.6667 7.37501 13.375 7.66668 13 7.66668H11.625C11.3333 9.70834 9.70833 11.3333 7.66667 11.625V13C7.66667 13.375 7.375 13.6667 7 13.6667C6.64587 13.6667 6.33333 13.375 6.33333 13V11.625C4.29167 11.3333 2.68747 9.70834 2.39587 7.66668H1C0.625 7.66668 0.333333 7.37501 0.333333 7.00001C0.333333 6.62501 0.625 6.33334 1 6.33334H2.39587C2.68747 4.27081 4.29167 2.66668 6.33333 2.35414V0.97921C6.33333 0.62501 6.64587 0.333344 7 0.333344ZM7 3.66668C5.16667 3.66668 3.66667 5.16668 3.66667 7.00001C3.66667 8.79168 5.08333 10.3125 7 10.3125C8.89587 10.3125 10.3333 8.81254 10.3333 7.00001C10.3333 5.16668 8.83333 3.66668 7 3.66668Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d="M5.66667 7.00001C5.66667 6.27081 6.2708 5.66668 7 5.66668C7.7292 5.66668 8.33333 6.27081 8.33333 7.00001C8.33333 7.72921 7.7292 8.33334 7 8.33334C6.2708 8.33334 5.66667 7.72921 5.66667 7.00001Z"
            fill="currentColor"
            fillRule="evenodd"
            part="circle"
          />
        </svg>
      </button>
    </div>
  );
}

export default memo(RouteScheduleHeader);
