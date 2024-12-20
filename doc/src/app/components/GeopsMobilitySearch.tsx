import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const GeopsMobilitySearch = forwardRef(
  (props: Record<string, unknown>, ref) => {
    return <geops-mobility-search ref={ref} {...props}></geops-mobility-search>;
  },
);

export default GeopsMobilitySearch;
