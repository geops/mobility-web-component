import { useEffect, useMemo, useState } from "preact/hooks";

import useMapContext from "./useMapContext";

import type { MocoAPI } from "mobility-toolbox-js/maplibre";
import type {
  MocoExportParameters,
  SituationType,
} from "mobility-toolbox-js/types";

function useMocoSituation(situationId?: string, params?: MocoExportParameters) {
  const { lang, notificationsLayer, previewNotifications } = useMapContext();
  const [situation, setSituation] = useState<SituationType>();

  const api: MocoAPI | undefined = useMemo(() => {
    return notificationsLayer?.api;
  }, [notificationsLayer]);

  useEffect(() => {
    const previewSituation = previewNotifications?.find((item) => {
      return item.id === situationId;
    });
    if (previewSituation) {
      setSituation(previewSituation);
      return;
    }

    const abortController = new AbortController();
    api
      ?.exportById(situationId, {
        contentLarge: true,
        contentMedium: true,
        contentSmall: true,
        includeGeoms: false,
        includeLines: true,
        includeStops: true,
        [lang]: true,
        limit: 1,
        ...(params || {}),
      })
      .then((response) => {
        setSituation(response);
      })
      .catch((err) => {
        // 20: AbortError
        if (err.code !== 20) {
          setSituation(undefined);
          // eslint-disable-next-line no-console
          console.error("Failed to fetch situation", err);
          return;
        }
      });

    return () => {
      abortController.abort();
    };
  }, [api, situationId, params, lang, previewNotifications]);

  return situation;
}

export default useMocoSituation;
