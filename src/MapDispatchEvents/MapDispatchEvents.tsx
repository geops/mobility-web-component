import { GeoJSON } from "ol/format";
import { memo } from "preact/compat";
import { useEffect } from "preact/hooks";

import useMapContext from "../utils/hooks/useMapContext";
import MobilityEvent from "../utils/MobilityEvent";

import type { MapBrowserEvent } from "ol";

import type { MobilityMapProps } from "../MobilityMap/MobilityMap";
import type { MobilityEventType } from "../utils/MobilityEvent";

const dispatchEvent = (
  node: HTMLElement | null,
  eventType: MobilityEventType,
  eventData: unknown,
) => {
  node?.dispatchEvent(
    new MobilityEvent(eventType, eventData, { bubbles: true }),
  );
};

const geojson = new GeoJSON();

/**
 * This component is responsible to dispatch events listenable for the window outside the web component.
 *
 * @example
 * const wc = document.getElementById("my-web-component");
 * wc.addEventListener("mwc:singleclick", (event) => {
 *   console.log(event.data);
 * });
 *
 * @param param0 - Props for the component
 * @returns JSX.Element | null
 */

function MapDispatchEvents({
  node,
  wcAttributes,
}: {
  node: HTMLDivElement | null;
  wcAttributes: MobilityMapProps;
}) {
  const { map, permalinkUrlSearchParams, selectedFeature } = useMapContext();

  // Send events when one of the web component attributes changes
  useEffect(() => {
    dispatchEvent(node, "mwc:attribute", wcAttributes);
  }, [node, wcAttributes]);

  // Send events when we click on the map
  useEffect(() => {
    map?.on("singleclick", (event: MapBrowserEvent) => {
      dispatchEvent(node, "mwc:singleclick", {
        coordinate: event.coordinate,
        pixel: event.pixel,
      });
    });
  }, [node, map]);

  // Send events when the selected feature changes
  useEffect(() => {
    const json = selectedFeature
      ? geojson.writeFeatureObject(selectedFeature)
      : null;

    // When the ol feature is a cluster
    if (json?.properties?.features?.length > 0) {
      json.properties.features = json.properties.features.map((feature) => {
        return geojson.writeFeatureObject(feature);
      });
    }
    dispatchEvent(node, "mwc:selectedfeature", json);
  }, [node, selectedFeature]);

  // Send current map state using URL Search parameters
  useEffect(() => {
    dispatchEvent(node, "mwc:permalink", permalinkUrlSearchParams?.toString());
  }, [node, permalinkUrlSearchParams]);

  return null;
}

export default memo(MapDispatchEvents);
