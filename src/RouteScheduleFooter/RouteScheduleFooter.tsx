import { memo } from "preact/compat";
import useMapContext from "../utils/hooks/useMapContext";

const defaultRenderLink = (text: string, url: string) => {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="underline whitespace-normal"
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
      <div className="m-4 mb-0 text-sm text-gray-500  flex flex-wrap ">
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
      <div className="bg-gradient-to-b from-transparent to-white h-8 sticky bottom-0 w-full pointer-events-none" />
    </>
  );
}

export default memo(RouteScheduleFooter);
