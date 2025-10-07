import { realtimeConfig } from "mobility-toolbox-js/ol";

const getTextColor = (type) => {
  return realtimeConfig.getTextColor(type);
};

export default getTextColor;
