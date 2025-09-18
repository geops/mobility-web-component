"use client";
import { Suspense } from "react";

import useIsFullScreen from "../hooks/useIsFullScreen";
import GeopsMobility from "./GeopsMobility";
import WebComponentDoc, { AttrConfig } from "./WebComponentDoc";

let attrsConfig: Record<string, AttrConfig>;

function GeopsMobilityDoc() {
  const isFullScreen = useIsFullScreen();

  if (typeof window !== undefined) {
    // @ts-expect-error - MobilityMapAttributes is added via a script file.
    attrsConfig = window.MobilityMapAttributes;
  }

  if (!attrsConfig) {
    return null;
  }

  return (
    <Suspense>
      <WebComponentDoc
        attrsConfig={attrsConfig}
        // @ts-expect-error -  must find the correct type
        Comp={GeopsMobility}
        compProps={{
          class: isFullScreen
            ? "fixed inset-0 w-screen h-sccreen z-9000 bg-white"
            : "block h-96 max-w-full resize overflow-auto  bg-white",
        }}
        tagName="geops-mobility"
      />
    </Suspense>
  );
}

export default GeopsMobilityDoc;
