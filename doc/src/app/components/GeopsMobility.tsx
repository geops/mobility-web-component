"use client";
import { forwardRef } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "geops-mobility": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > &
        Record<string, unknown>;
    }
  }
}

const GeopsMobility = forwardRef<HTMLDivElement, Record<string, unknown>>(
  (props, ref) => {
    return <geops-mobility ref={ref} {...props}></geops-mobility>;
  },
);
GeopsMobility.displayName = "GeopsMobility";

export default GeopsMobility;
