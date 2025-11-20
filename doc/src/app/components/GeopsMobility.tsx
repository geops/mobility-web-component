"use client";
import { forwardRef } from "react";

const GeopsMobility = forwardRef((props: Record<string, unknown>, ref) => {
  return <geops-mobility ref={ref} {...props}></geops-mobility>;
});

export default GeopsMobility;
