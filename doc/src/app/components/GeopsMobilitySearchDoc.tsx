import "@geops/mobility-web-component";
import { TextFieldProps, Typography } from "@mui/material";
import { forwardRef, ReactNode } from "react";

import WebComponentDoc from "./WebComponentDoc";
interface AttrConfig {
  defaultValue?: string;
  description: ReactNode;
  props?: TextFieldProps;
  type: "checkbox" | "date" | "select" | "textfield";
}

const attrsConfig: Record<string, AttrConfig> = {
  apikey: {
    description: (
      <Typography>
        Your{" "}
        <a href="https://developer.geops.io/" rel="noreferrer" target="_blank">
          geOps API key
        </a>
        .
      </Typography>
    ),
    type: "textfield",
  },
  bbox: {
    description: (
      <Typography>
        The extent where to search the stops (minx,miny,maxx,maxy).
      </Typography>
    ),
    type: "textfield",
  },
  limit: {
    defaultValue: "5",
    description: <Typography>The number of suggestions to show.</Typography>,
    props: {
      slotProps: {
        input: {
          max: 100,
          min: 0,
          step: 1,
        },
      },
      type: "number",
    },
    type: "textfield",
  },
  mots: {
    description: (
      <Typography>
        Commas separated list of mots used to filter the results (rail, bus,
        coach, foot, tram, subway, gondola, funicular, ferry, car).
      </Typography>
    ),
    type: "textfield",
  },
  url: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: (
      <Typography>
        The
        <a
          href="https://developer.geops.io/apis/stops"
          rel="noreferrer"
          target="_blank"
        >
          geOps Stops API
        </a>{" "}
        url to use.
      </Typography>
    ),
    type: "textfield",
  },
};

// eslint-disable-next-line react/display-name
const GeopsMobilitySearch = forwardRef(
  (props: Record<string, unknown>, ref) => {
    return (
      <geops-mobility-search
        class="block max-w-3xl border"
        ref={ref}
        {...props}
      ></geops-mobility-search>
    );
  },
);

function GeopsMobilitySearchDoc() {
  return (
    <WebComponentDoc
      attrsConfig={attrsConfig}
      Comp={GeopsMobilitySearch}
      events={["mwc:stopssearchselect"]}
      tagName="geops-mobility-search"
    />
  );
}

export default GeopsMobilitySearchDoc;
