import { createContext } from "preact";

export type UseI18NContextType = {
  t: (id: string) => string;
};

const I18nContext = createContext({ t: () => {} });
export default I18nContext;
