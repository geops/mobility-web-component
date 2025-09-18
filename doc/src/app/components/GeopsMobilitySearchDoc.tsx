"use client";
import { Suspense } from "react";

import GeopsMobilitySearch from "./GeopsMobilitySearch";
import WebComponentDoc, { AttrConfig } from "./WebComponentDoc";

let attrsConfig: Record<string, AttrConfig>;

function GeopsMobilitySearchDoc() {
  if (typeof window !== undefined) {
    // @ts-expect-error - MobilitySearchAttributes is added via a script file.
    attrsConfig = window.MobilitySearchAttributes;
  }

  if (!attrsConfig) {
    return null;
  }

  return (
    <Suspense>
      <WebComponentDoc
        attrsConfig={attrsConfig}
        // @ts-expect-error -  must find the correct type
        Comp={GeopsMobilitySearch}
        compProps={{ class: "block w-full border" }}
        events={["mwc:stopssearchselect"]}
        tagName="geops-mobility-search"
      />
    </Suspense>
  );
}

export default GeopsMobilitySearchDoc;
