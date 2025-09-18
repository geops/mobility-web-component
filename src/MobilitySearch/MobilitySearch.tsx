import { memo } from "preact/compat";

import StopsSearch from "../StopsSearch/StopsSearch";
import { I18nContext } from "../utils/hooks/useI18n";
import i18n from "../utils/i18n";

import MobilitySearchAttributes from "./MobilitySearchAttributes";

// @ts-expect-error tailwind must be added for the search web component
import tailwind from "../style.css";

import type { StopsSearchProps } from "../StopsSearch/StopsSearch";

export type MobilitySearchProps = StopsSearchProps;

function MobilitySearch(props: MobilitySearchProps) {
  return (
    <I18nContext.Provider value={i18n}>
      <style>{tailwind}</style>
      <StopsSearch {...props} />
    </I18nContext.Provider>
  );
}

// We creates a wrapper to inject the default props values from MobilityMapAttributes.
const defaultProps = {};
Object.entries(MobilitySearchAttributes).forEach(([key]) => {
  defaultProps[key] = MobilitySearchAttributes[key].defaultValue || null;
});

function MobilitySearchWithDefaultProps(props: MobilitySearchProps) {
  return <MobilitySearch {...defaultProps} {...props} />;
}

export default memo(MobilitySearchWithDefaultProps);
