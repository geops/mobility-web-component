import rosetta from "rosetta";
import translations from "./translations";

const i18n = rosetta(translations);

// Set current language to preferred browser language with fallback to english
i18n.locale(
  navigator.languages // @ts-expect-error bad type definition
    .find((l) => i18n.table(l.split("-")[0]) !== undefined)
    ?.split("-")[0] || "en",
);

export default i18n;
