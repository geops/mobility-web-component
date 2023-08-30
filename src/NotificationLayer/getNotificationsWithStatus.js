import GeoJSON from "ol/format/GeoJSON";
import { getCenter } from "ol/extent";

const format = new GeoJSON();

export const getTime = (str) =>
  parseInt(str?.substr(0, 8).replace(/:/g, ""), 10);

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
          time_of_day_start: dayTimeStart,
          time_of_day_end: dayTimeEnd,
          start,
          end,
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
            minute: "2-digit",
            hour12: false,
          })}`;
        }
      } else {
        starts = `ab ${nextStartDate.toLocaleDateString(["de-DE"], {
          month: "short",
          day: "numeric",
        })}`;
      }

      let iconRefPoint;
      const iconRef = n.features.find((f) => f.properties.is_icon_ref);
      if (iconRef) {
        const iconRefFeature = format.readFeature(iconRef, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        });
        const center = getCenter(iconRefFeature.getGeometry().getExtent());
        iconRefPoint = iconRefFeature.getGeometry().getClosestPoint(center);
      }

      const properties = {
        ...n.properties,
        iconRefPoint,
        isActive,
        starts,
      };

      const features = n.features.map((f) => ({
        ...f,
        properties: { ...f.properties, ...properties },
      }));

      return {
        ...n,
        features,
        properties,
      };
    });
};

export default getNotificationsWithStatus;
