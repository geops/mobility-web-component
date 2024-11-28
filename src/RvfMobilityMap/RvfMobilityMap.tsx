import { getCenter } from "ol/extent";
import { fromLonLat } from "ol/proj";
import { memo } from "preact/compat";

import MobilityMap, { MobilityMapProps } from "../MobilityMap/MobilityMap";

const extent = [7.5, 47.7, 8.45, 48.4];
const center = fromLonLat(getCenter(extent));

function RvfMobilityMap(props: MobilityMapProps) {
  return (
    <MobilityMap
      center={center.join(",")}
      search={"false"}
      zoom={"10"}
      {...props}
    />
  );
}

export default memo(RvfMobilityMap);
