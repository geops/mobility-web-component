"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/GeopsMobilityDoc"),
  { ssr: false },
);

export default function GeopsMobility() {
  return <DynamicComponentWithNoSSR />;
}
