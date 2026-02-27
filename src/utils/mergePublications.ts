import type { PublicationType } from "mobility-toolbox-js/types";

/**
 * When imported from external source, some publication have the same publication
 * windows and the same textualContents but only differs the lines or stations.
 * In that case we merge them (lines and stops) to avoid duplicates in the display.
 * TODO fixes this in backend oder import
 */
const mergePublications = (
  publications: PublicationType[] = [],
): PublicationType[] => {
  const mergedPublications: PublicationType[] = [];
  try {
    publications.forEach((publication) => {
      const publicationsWindowsStr = JSON.stringify(
        publication.publicationWindows,
      );
      const textualContentStr = JSON.stringify(publication.textualContents);

      // Find a previous identical publication
      const identicalPublication = mergedPublications.find((p) => {
        return (
          p.severity === publication.severity &&
          p.serviceCondition === publication.serviceCondition &&
          JSON.stringify(p.publicationWindows) === publicationsWindowsStr &&
          JSON.stringify(p.textualContents) === textualContentStr
        );
      });

      if (identicalPublication) {
        // We move the lines and stops on the same publication to display them together and avoid duplicates
        identicalPublication.publicationLines = [
          ...(identicalPublication.publicationLines || []),
          ...(publication.publicationLines || []),
        ];
        identicalPublication.publicationStops = [
          ...(identicalPublication.publicationStops || []),
          ...(publication.publicationStops || []),
        ];
        return false;
      }
      mergedPublications.push(publication);
    });
  } catch (error) {
    // JSON parsing could failed, we log the error and return the non merged
    // publications to avoid breaking the display
    console.error("Error merging publications", error);
    return publications;
  }
  return mergedPublications;
};
export default mergePublications;
