import type { ViewState } from "mobility-toolbox-js/types";

/**
 * Return the font depending on an object representing a vehicle or a line.
 * This function is used to have the same font on the map and on other components.
 */
const getTextFontForVehicle = (
  object?: unknown,
  viewState?: ViewState,
  fontSize?: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  text?: string,
) => {
  return `bold ${fontSize}px arial`;
};

export default getTextFontForVehicle;
