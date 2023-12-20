/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type UseI18NContextType = {
  t: (id: string) => string;
};

export const I18nContext = createContext({ t: (id: string) => id });

const useI18n = (): UseI18NContextType => {
  const context = useContext<UseI18NContextType>(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within a ContextProvider");
  }
  return context;
};

export default useI18n;
