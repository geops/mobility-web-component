import { memo, useMemo } from "preact/compat";
import rosetta from "rosetta";

import { I18nContext } from "../utils/hooks/useI18n";
import translations from "../utils/translations";
// import rosetta from 'rosetta/debug';

const i18n = rosetta(translations);

export const defaultLanguage = "en";
export const languages = ["de", "en", "fr", "it"];

export interface I18nProps {
  children: React.ReactNode;
  lngDict?: Record<string, Record<string, string>>;
  locale?: string;
}

function I18n({ children, locale = defaultLanguage }: I18nProps) {
  const i18nWrapper = useMemo(() => {
    i18n.locale(locale);

    return {
      locale: (lang?: string) => {
        return i18n.locale(lang);
      },
      t: (...args: [key: string, params?: Record<string, unknown>]) => {
        return i18n.t(...args);
      },
    };
  }, [locale]);

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  );
}

export default memo(I18n);
