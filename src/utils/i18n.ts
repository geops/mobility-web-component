import rosetta from "rosetta";

const i18n = rosetta({
  de: {
    platform_rail: "Gl.",
    platform_ferry: "St.",
    platform_other: "Kan.",
  },
  en: {
    platform_rail: "Pl.",
    platform_ferry: "Pier", // pier
    platform_other: "Std.", // stand
  },
  fr: {
    platform_rail: "Voie",
    platform_ferry: "Quai",
    platform_other: "Quai",
  },
  it: {
    platform_rail: "Bin.",
    platform_ferry: "Imb.", // imbarcadero
    platform_other: "Cor.", // corsia
  },
});

// Set current language to preferred browser language with fallback to english
i18n.locale(
  navigator.languages // @ts-ignore
    .find((l) => i18n.table(l.split("-")[0]) !== undefined)
    ?.split("-")[0] || "en",
);

export default i18n;
