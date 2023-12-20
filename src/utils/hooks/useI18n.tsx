/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type I18NContextType = {
  t: (id: string, templateValues: { [key: string]: string }) => string;
};

export const I18nContext = createContext({
  t: (id, templateValues) => `${id} ${JSON.stringify(templateValues)}`,
} as I18NContextType);

const useI18n = (): I18NContextType => {
  const context = useContext<I18NContextType>(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a ContextProvider");
  }
  return context;
};

export default useI18n;
