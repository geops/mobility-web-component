import { Typography } from "@mui/material";
import { Suspense } from "react";

import GeopsAPIKeyLink from "./GeopsAPIKeyLink";
import GeopsMobilitySearch from "./GeopsMobilitySearch";
import GeopsStopsAPILink from "./GeopsStopsAPILink";
import WebComponentDoc, { AttrConfig } from "./WebComponentDoc";

const attrsConfig: Record<string, AttrConfig> = {
  apikey: {
    description: (
      <Typography>
        Your <GeopsAPIKeyLink />.
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
  countrycode: {
    description: (
      <Typography>
        The country code to filter the results (IT, DE, CH ...)
      </Typography>
    ),
    type: "textfield",
  },
  event: {
    defaultValue: "mwc:stopssearchselect",
    description: (
      <Typography>
        The event&pos;s name to listen to when a stop is selected.
      </Typography>
    ),
    type: "textfield",
  },
  field: {
    description: (
      <Typography>
        Which field to look up, default all of them, Possible values:id, name,
        coords.
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
  params: {
    description: (
      <Typography>
        JSON string with additional parameters to pass to the request to the
        API. Ex: {"{ 'key': 'value' }"}
      </Typography>
    ),
    type: "textfield",
  },
  prefagencies: {
    description: (
      <Typography>
        Comma seperated list, order chooses which agency will be preferred as
        ident_source (for id and code fields). Possible values: sbb, db.
      </Typography>
    ),
    type: "textfield",
  },
  reflocation: {
    description: (
      <Typography>
        Coordinates in WGS84 (in lat,lon order) used to rank stops close to this
        position higher
      </Typography>
    ),
    type: "textfield",
  },
  url: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: (
      <Typography>
        The <GeopsStopsAPILink /> url to use.
      </Typography>
    ),
    type: "textfield",
  },
};

function GeopsMobilitySearchDoc() {
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
