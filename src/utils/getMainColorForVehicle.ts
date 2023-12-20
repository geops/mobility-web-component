import { RealtimeMot } from "mobility-toolbox-js/types";
import getBgColor from "./getBgColor";

// This function returns the main color of a line using a line, trajectory, stopsequence or departure object.
const getMainColorForVehicle = (object: any) => {
  const { type, vehicleType, train_type: trainType } = object || {};
  const lineToUse = object?.properties?.line || object?.line || object;
  return (
    lineToUse?.color ||
    getBgColor((type || vehicleType || trainType || "rail") as RealtimeMot)
  );
};
export default getMainColorForVehicle;
