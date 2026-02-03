import { forwardRef } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "geops-mobility-search": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        Record<string, unknown>;
    }
  }
}

const GeopsMobilitySearch = forwardRef<HTMLDivElement, Record<string, unknown>>(
  (props, ref) => {
    return <geops-mobility-search ref={ref} {...props}></geops-mobility-search>;
  },
);
GeopsMobilitySearch.displayName = "GeopsMobilitySearch";

export default GeopsMobilitySearch;
