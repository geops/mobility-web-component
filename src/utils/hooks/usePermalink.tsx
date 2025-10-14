// import debounce from "lodash.debounce";
// import { getLayersAsFlatArray } from "mobility-toolbox-js/ol";
// import { unByKey } from "ol/Observable";
// import { useCallback, useEffect } from "preact/hooks";

import getUrlFromTemplate from "../getUrlFromTemplate";

import useMapContext from "./useMapContext";

// import { LAYER_PROP_IS_EXPORTING } from "../constants";
// import getPermalinkParameters from "../getPermalinkParameters";
// // import getLayersAsFlatArray from "../getLayersAsFlatArray";

// import useMapContext from "./useMapContext";

// import type { Map } from "ol";
// import type { EventsKey } from "ol/events";

function usePermalink() {
  const { permalinktemplate, permalinkUrlSearchParams } = useMapContext();
  const url = getUrlFromTemplate(permalinktemplate, permalinkUrlSearchParams);
  return url;
}

export default usePermalink;
