import { FeatureCollection } from "geojson";
import { Feature } from "ol";
import { getCenter } from "ol/extent";
import GeoJSON from "ol/format/GeoJSON";

import addSourceAndLayers from "../utils/addSourceAndLayers";

const format = new GeoJSON();

export const getTime = (str) => {
  return parseInt(str?.substr(0, 8).replace(/:/g, ""), 10);
};

/**
 *
 * @param {Array.<Object>} notifications Raw notifications
 * @param {Date} now The date to compare with the affected_time_intervals
 * @returns {Array.<Object>}
 */
const getNotificationsWithStatus = (notifications, now) => {
  return notifications
    .filter((n) => {
      // TODO: The backend should be responsible to returns only good notifications.
      const notOutOfDate = n.properties.affected_time_intervals.some((ati) => {
        return now < new Date(ati.end);
      });
      return notOutOfDate;
    })
    .map((n) => {
      const isActive = n.properties.affected_time_intervals.some((ati) => {
        const {
          end,
          start,
          time_of_day_end: dayTimeEnd,
          time_of_day_start: dayTimeStart,
        } = ati;
        const nowTime = getTime(now.toTimeString());
        const startTime = getTime(dayTimeStart);
        const endTime = getTime(dayTimeEnd);
        const inRange = new Date(start) <= now && now <= new Date(end);
        return startTime && endTime
          ? inRange && startTime <= nowTime && nowTime <= endTime
          : inRange;
      });

      const next = n.properties.affected_time_intervals.reduce((a, b) => {
        const aEnd = new Date(a.end);
        const aStart = new Date(a.start);
        const bStart = new Date(b.start);
        return now < aEnd && aStart < bStart ? a : b;
      }, []);
      const nextStartDate = new Date(next.start);
      let starts;
      if (
        now.toDateString() === nextStartDate.toDateString() ||
        now.getTime() - nextStartDate.getTime() > 0
      ) {
        if (next.time_of_day_start) {
          starts = `ab ${next.time_of_day_start.substr(0, 5)}`;
        } else {
          starts = `ab ${nextStartDate.toLocaleTimeString(["de"], {
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
          })}`;
        }
      } else {
        starts = `ab ${nextStartDate.toLocaleDateString(["de-DE"], {
          day: "numeric",
          month: "short",
        })}`;
      }

      let iconRefPoint;
      const iconRef = n.features.find((f) => {
        return f.properties.is_icon_ref;
      });
      if (iconRef) {
        const iconRefFeature = format.readFeature(iconRef, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }) as Feature;
        const center = getCenter(iconRefFeature.getGeometry().getExtent());
        iconRefPoint = iconRefFeature.getGeometry().getClosestPoint(center);
      }

      const properties = {
        ...n.properties,
        iconRefPoint,
        isActive,
        starts,
      };

      const features = n.features.map((f) => {
        return {
          ...f,
          properties: { ...f.properties, ...properties },
        };
      });

      return {
        ...n,
        features,
        properties,
      };
    });
};

const getCurrentGraph = (mapping: object, zoom: number) => {
  const breakPoints = Object.keys(mapping).map((k) => {
    return parseFloat(k);
  });
  const closest = breakPoints.reverse().find((bp) => {
    return bp <= Math.floor(zoom) - 1;
  }); // - 1 due to ol zoom !== mapbox zoom
  return mapping[closest || Math.min(...breakPoints)];
};

/**
 * This function add layers in the mapbox style to show notifications lines.
 */
const addNotificationsLayers = (
  mapboxLayer: object,
  notifications: FeatureCollection[],
  beforeLayerId: string,
  zoom: number,
  graphMapping: object,
) => {
  if (!mapboxLayer) {
    return;
  }
  const features = notifications
    .map((n) => {
      return n.features;
    })
    .flat();
  addSourceAndLayers(
    mapboxLayer,
    "notifications",
    {
      data: {
        features,
        type: "FeatureCollection",
      },
      type: "geojson",
    },
    [
      {
        filter: [
          "all",
          ["==", ["get", "isActive"], true],
          ["==", ["get", "graph"], getCurrentGraph(graphMapping, zoom)],
          ["==", ["get", "disruption_type"], "DISRUPTION"],
        ],
        id: "notificationsActive",
        layout: { visibility: "visible" },
        paint: {
          "line-color": "rgba(255,0,0,1)",
          "line-dasharray": [2, 2],
          "line-width": 5,
        },
        source: "notifications",
        type: "line",
      },
    ],
    beforeLayerId,
  );
};

const parsePreviewNotification = (mocoPreviewObject: {
  graphs: object;
  id: number;
}) => {
  let properties = {};
  const features = Object.keys(mocoPreviewObject.graphs).map((graph) => {
    const feature = mocoPreviewObject.graphs[graph].features[0];
    properties = mocoPreviewObject.graphs[graph].properties;
    return { ...feature, properties: { ...feature.properties, graph } };
  });
  return {
    features,
    properties,
    type: "FeatureCollection",
  };
};

export {
  addNotificationsLayers,
  getNotificationsWithStatus,
  parsePreviewNotification,
};
