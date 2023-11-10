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
  const { lineInfos } = useMapContext();
  if (!lineInfos.operator && !lineInfos.publisher) {
    return null;
  }

  return (
    <>
      <div className="m-4 mb-0 text-sm text-gray-500  flex flex-wrap ">
        {lineInfos.operator &&
          defaultRenderLink(lineInfos.operator, lineInfos.operatorUrl)}
        {lineInfos.operator && lineInfos.publisher && <span> - </span>}
        {lineInfos.publisher &&
          defaultRenderLink(lineInfos.publisher, lineInfos.publisherUrl)}
        {lineInfos.license && <span>&nbsp;(</span>}
        {lineInfos.license &&
          defaultRenderLink(lineInfos.license, lineInfos.licenseUrl)}
        {lineInfos.license && ")"}
      </div>
      <div className="bg-gradient-to-b from-transparent to-white h-8 sticky bottom-0 w-full pointer-events-none" />
    </>
  );
}

export default memo(RouteScheduleFooter);
