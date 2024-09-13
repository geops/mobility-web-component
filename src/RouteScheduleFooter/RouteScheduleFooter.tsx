import { memo } from "preact/compat";

import useMapContext from "../utils/hooks/useMapContext";

const defaultRenderLink = (text: string, url: string) => {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="whitespace-normal underline"
    >
      {text}
    </a>
  ) : (
    text
  );
};

function RouteScheduleFooter() {
  const { stopSequence } = useMapContext();
  if (!stopSequence.operator && !stopSequence.publisher) {
    return null;
  }

  return (
    <>
      <div className="m-4 mb-0 flex flex-wrap  text-sm text-gray-500 ">
        {stopSequence.operator &&
          defaultRenderLink(stopSequence.operator, stopSequence.operatorUrl)}
        {stopSequence.operator && stopSequence.publisher && <span> - </span>}
        {stopSequence.publisher &&
          defaultRenderLink(stopSequence.publisher, stopSequence.publisherUrl)}
        {stopSequence.license && <span>&nbsp;(</span>}
        {stopSequence.license &&
          defaultRenderLink(stopSequence.license, stopSequence.licenseUrl)}
        {stopSequence.license && ")"}
      </div>
      <div className="pointer-events-none sticky bottom-0 h-8 w-full bg-gradient-to-b from-transparent to-white" />
    </>
  );
}

export default memo(RouteScheduleFooter);
