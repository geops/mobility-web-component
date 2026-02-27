import mergePublications from "./mergePublications";

import type { PublicationType } from "mobility-toolbox-js/types";

describe("mergePublications", () => {
  it("should merge publications with same publication windows and textual contents", () => {
    const publications = [
      {
        publicationLines: [
          {
            category: "DISRUPTION",
            hasIcon: true,
            lines: [
              {
                name: "510",
                operatorRef: "SBG",
              },
              {
                name: "510",
                operatorRef: "SBG",
              },
              {
                name: "510",
                operatorRef: "SBG",
              },
            ],
            mot: "BUS",
          },
        ],
        publicationStops: [],
        publicationWindows: [],
        serviceCondition: "DIVERTED",
        serviceConditionGroup: "CHANGES",
        severity: "NORMAL",
        severityGroup: "NORMAL",
        textualContentLarge: null,
        textualContentMedium: {
          de: {
            consequence: "",
            description:
              "Zwischen <b>Denzlingen Mattenbühl</b> und <b>Denzlingen Bahnhof</b> kommt es vom <b>26. Februar 2026 ab 08:00 Uhr bis auf Weiteres</b> zu <b>einer Umleitung und Haltausfällen</b> wegen einer Baumaßnahme. Betroffen <b>sind die Linien 510 und 512</b>. Es kommt zu folgenden Änderungen:<br>\n                <b>Umleitung Linie 510</b>: Die Haltestellen Denzlingen Gewerbegebiet bis Denzlingen Mattenbühl werden nicht bedient.  <br><br>Die Änderungen sind in der elektronischen Fahrplanauskunft EFA hinterlegt.",
            durationText: "",
            reason: "",
            recommendation: "",
            summary:
              "Linien 510 und 512: Umleitung und Haltentfall wegen einer Baumaßnahme",
          },
        },
      },
      {
        publicationLines: [
          {
            category: "DISRUPTION",
            hasIcon: true,
            lines: [
              {
                name: "512",
                operatorRef: "SBG",
              },
            ],
            mot: "BUS",
          },
        ],
        publicationStops: [],
        publicationWindows: [],
        serviceCondition: "DIVERTED",
        serviceConditionGroup: "CHANGES",
        severity: "NORMAL",
        severityGroup: "NORMAL",
        textualContentLarge: null,
        textualContentMedium: {
          de: {
            consequence: "",
            description:
              "Zwischen <b>Denzlingen Mattenbühl</b> und <b>Denzlingen Bahnhof</b> kommt es vom <b>26. Februar 2026 ab 08:00 Uhr bis auf Weiteres</b> zu <b>einer Umleitung und Haltausfällen</b> wegen einer Baumaßnahme. Betroffen <b>sind die Linien 510 und 512</b>. Es kommt zu folgenden Änderungen:<br>\n                <b>Umleitung Linie 510</b>: Die Haltestellen Denzlingen Gewerbegebiet bis Denzlingen Mattenbühl werden nicht bedient.  <br><br>Die Änderungen sind in der elektronischen Fahrplanauskunft EFA hinterlegt.",
            durationText: "",
            reason: "",
            recommendation: "",
            summary:
              "Linien 510 und 512: Umleitung und Haltentfall wegen einer Baumaßnahme",
          },
        },
      },
    ] as PublicationType[];
    const merged = mergePublications(publications);
    expect(merged).toHaveLength(1);
    expect(merged[0].publicationLines).toHaveLength(2);
    expect(merged[0].publicationLines?.[0].lines[0].name).toBe("510");
    expect(merged[0].publicationLines?.[1].lines[0].name).toBe("512");
  });
});
