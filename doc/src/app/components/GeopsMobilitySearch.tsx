import { forwardRef } from "react";

const GeopsMobilitySearch = forwardRef(
  (props: Record<string, unknown>, ref) => {
    return <geops-mobility-search ref={ref} {...props}></geops-mobility-search>;
  },
);

export default GeopsMobilitySearch;
