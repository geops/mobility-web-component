import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { Rosetta } from "rosetta";

import type { Translations } from "../translations";

export type I18NContextType = Rosetta<Translations>;

export const I18nContext = createContext({
  t: (id: string, templateValues?: Record<string, string>) => {
    return `${id} ${JSON.stringify(templateValues)}`;
  },
} as I18NContextType);

const useI18n = (): I18NContextType => {
  const context = useContext<I18NContextType>(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a ContextProvider");
  }
  return context;
};

export default useI18n;
