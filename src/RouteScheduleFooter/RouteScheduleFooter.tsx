import { memo } from "preact/compat";

import useMapContext from "../utils/hooks/useMapContext";

const defaultRenderLink = (text: string, url: string) => {
  return url ? (
    <a
      className="whitespace-normal underline"
      href={url}
      rel="noreferrer"
      target="_blank"
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
      <div className="m-4 mb-0 flex flex-wrap text-[10px] text-gray-500">
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
    </>
  );
}

export default memo(RouteScheduleFooter);
