import { RealtimeLayer, MaplibreLayer } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { createContext } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { RealtimeMot } from "mobility-toolbox-js/types";
import rosetta from "rosetta";

import RouteSchedule from "./RouteSchedule";
// @ts-ignore
import olStyle from "ol/ol.css";
// @ts-ignore
import style from "./style.css";
// @ts-ignore
import style2 from "./RealtimeMap.css";
import GeolocationButton from "./GeolocationButton";
import ScaleLine from "./ScaleLine";
import Copyright from "./Copyright";
import ScrollableHandler from "./ScrollableHandler";

const i18n = rosetta({
  de: {
    depature_rail: "Gleis",
    depature_ferry: "Steg",
    depature_other: "Kante",
  },
  en: {
    depature_rail: "platform",
    depature_ferry: "pier",
    depature_other: "stand",
  },
  fr: {
    depature_rail: "voie",
    depature_ferry: "quai",
    depature_other: "quai",
  },
  it: {
    depature_rail: "binario",
    depature_ferry: "imbarcadero",
    depature_other: "corsia",
  },
});

// Set current language to preferred browser language with fallback to english
i18n.locale(
  navigator.languages // @ts-ignore
    .find((l) => i18n.table(l.split("-")[0]) !== undefined)
    ?.split("-")[0] || "en",
);

export const I18nContext = createContext(i18n);

type Props = {
  apikey: string;
  baselayer: string;
  center: string;
  mots?: string;
  tenant: string;
  zoom: string;
};

let deltaToTop = 0;

function onDragg(evt: PointerEvent) {
  this.style.maxHeight = `calc(100% - ${evt.y - deltaToTop}px)`;
  evt.stopPropagation();
  evt.preventDefault();
}

function onDragStop(evt: PointerEvent) {
  this.style.transitionDuration = ".5s";
  if (this.clientHeight < 62) {
    this.isMinimized = true;
  }
  (evt.target as HTMLElement).releasePointerCapture(evt.pointerId);

  document.removeEventListener("pointermove", this.onDragg);
  document.removeEventListener("pointerup", this.onDragStop);
  evt.stopPropagation();
  evt.preventDefault();
}

const map = new Map({ controls: [] });

function RealtimeMap({ apikey, baselayer, center, mots, tenant, zoom }: Props) {
  const ref = useRef();
  const mapRef = useRef();
  const [lineInfos, setLineInfos] = useState(null);
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    map.getView().setCenter(center.split(",").map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
  }, [center, zoom]);

  const tracker = useMemo(() => {
    if (apikey) {
      return new RealtimeLayer({
        apiKey: apikey,
        url: "wss://api.geops.io/tracker-ws/v1/ws",
        getMotsByZoom: mots
          ? () => mots.split(",") as RealtimeMot[]
          : undefined,
        fullTrajectoryStyle: null,
        tenant,
      });
    }
  }, [apikey, mots, tenant]);

  useEffect(() => {
    if (!tracker) {
      return;
    }

    if (mapRef.current) {
      map.setTarget(mapRef.current);
      map.updateSize();
    }

    const layer = new MaplibreLayer({
      apiKey: apikey,
      url: `https://maps.geops.io/styles/${baselayer}/style.json`,
    });
    layer.attachToMap(map);

    tracker.attachToMap(map);
    tracker.onClick(([feature]) => {
      setFeature(feature);
    });

    return () => {
      map.setTarget();
    };
  }, [baselayer, tracker]);

  useEffect(() => {
    let vehicleId = null;
    if (feature) {
      vehicleId = feature.get("train_id");
      tracker.api.subscribeStopSequence(vehicleId, ({ content }) => {
        if (content) {
          const [stopSequence] = content;
          if (stopSequence) {
            setLineInfos(stopSequence);
          }
        }
      });
    } else {
      setLineInfos(null);
    }
    return () => {
      if (vehicleId) {
        tracker.api.unsubscribeStopSequence(vehicleId);
      }
    };
  }, [feature]);

  return (
    <I18nContext.Provider value={i18n}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <style>{style2}</style>
      <div ref={ref} className="@container/main w-full h-full relative border">
        <div className="w-full h-full relative flex flex-col @lg/main:flex-row-reverse">
          <div ref={mapRef} className="flex-1 relative overflow-hidden ">
            <div className="z-20 absolute right-2 top-2 flex flex-col gap-2">
              <GeolocationButton map={map} />
            </div>
            <div className="z-10 absolute left-2 right-2 text-[10px] bottom-2 flex justify-between items-end gap-2">
              <ScaleLine
                map={map}
                className={"bg-slate-50 bg-opacity-70"}
              ></ScaleLine>
              <Copyright
                map={map}
                className={"bg-slate-50 bg-opacity-70"}
              ></Copyright>
            </div>
          </div>
          <div
            className={`flex-0 relative overflow-hidden border-t @lg:borderstopSequence-t-0 @lg:border-r flex flex-col ${
              lineInfos
                ? "w-full min-h-[75px] max-h-[70%] @lg:w-[350px] @lg:max-h-full @lg:h-[100%!important]"
                : "hidden"
            }`}
            // style={{ maxHeight: "calc(100% - 150px)" }}
          >
            {!!lineInfos && (
              <>
                <ScrollableHandler className="z-10 absolute inset-0 w-full h-[60px] touch-none @lg:hidden" />
                <RouteSchedule
                  className="z-5 relative overflow-x-hidden overflow-y-auto  scrollable-inner"
                  lineInfos={lineInfos}
                  trackerLayer={tracker}
                  onStationClick={(station) => {
                    console.log("station click");
                    if (station.coordinate) {
                      map.getView().animate({
                        zoom: map.getView().getZoom(),
                        center: [station.coordinate[0], station.coordinate[1]],
                      });
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </I18nContext.Provider>
  );
}

export default RealtimeMap;
