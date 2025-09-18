"use client";
import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/GeopsMobilitySearchDoc"),
  { ssr: false },
);

export default function GeopsMobilitySearch() {
  return <DynamicComponentWithNoSSR />;
}
