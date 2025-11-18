import { memo } from "preact/compat";

import I18n from "../I18n";
import StopsSearch from "../StopsSearch/StopsSearch";

import MobilitySearchAttributes from "./MobilitySearchAttributes";

// @ts-expect-error tailwind must be added for the search web component
import tailwind from "../style.css";

import type { StopsSearchProps } from "../StopsSearch/StopsSearch";

export type MobilitySearchProps = StopsSearchProps;

function MobilitySearch(props: MobilitySearchProps) {
  const { lang } = props;
  return (
    <I18n lang={lang}>
      <style>{tailwind}</style>
      <StopsSearch {...props} />
    </I18n>
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
