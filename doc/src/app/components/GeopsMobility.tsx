"use client";
import { forwardRef } from "react";

// eslint-disable-next-line react/display-name
const GeopsMobility = forwardRef((props: Record<string, unknown>, ref) => {
  return (
    <geops-mobility
      class="block h-96 max-w-full resize overflow-auto"
      ref={ref}
      {...props}
    ></geops-mobility>
  );
});

export default GeopsMobility;
