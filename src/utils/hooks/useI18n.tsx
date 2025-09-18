import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface I18NContextType {
  t: (id: string, templateValues?: Record<string, string>) => string;
}

export const I18nContext = createContext({
  t: (id, templateValues) => {
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
