import { createContext } from "preact";
import rosetta from "rosetta";
// @ts-ignore
import tailwind from "../style.css";
// @ts-ignore
import style from "./index.css";
import RealtimeMap from "../RealtimeMap";

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

export type MobilityMapProps = {
  apikey: string;
  baselayer: string;
  center: string;
  mots?: string;
  tenant: string;
  zoom: string;
};

function MobilityMap(props: MobilityMapProps) {
  return (
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <style>{style}</style>
      <RealtimeMap {...props} />
    </I18nContext.Provider>
  );
}

export default MobilityMap;
