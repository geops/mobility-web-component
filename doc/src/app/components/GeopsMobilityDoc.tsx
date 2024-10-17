import { Typography } from "@mui/material";
import { Suspense } from "react";

import GeopsMobility from "./GeopsMobility";
import WebComponentDoc, { AttrConfig } from "./WebComponentDoc";

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
  baselayer: {
    defaultValue: "travic_v2",
    description: (
      <Typography>
        The style&apos;s name from the{" "}
        <a
          href="https://developer.geops.io/apis/maps"
          rel="noreferrer"
          target="_blank"
        >
          geOps Maps API
        </a>{" "}
        (base_dark_v2, base_bright_v2, ...).
      </Typography>
    ),
    type: "select",
  },
  center: {
    defaultValue: "831634,5933959",
    description: (
      <Typography>The center of the map in EPSG:3857 coordinates.</Typography>
    ),
    type: "textfield",
  },
  geolocation: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the geolocation button or not (true or false).
      </Typography>
    ),
    type: "checkbox",
  },
  mapsurl: {
    defaultValue: "https://maps.geops.io",
    description: (
      <Typography>
        The{" "}
        <a
          href="https://developer.geops.io/apis/maps"
          rel="noreferrer"
          target="_blank"
        >
          geOps Maps API
        </a>{" "}
        url to use.
      </Typography>
    ),
    type: "textfield",
  },
  maxzoom: {
    description: <Typography>Define the max zoom level of the map.</Typography>,
    props: {
      slotProps: {
        input: {
          max: 22,
          min: 0,
          step: 1,
        },
      },
      type: "number",
    },
    type: "textfield",
  },
  minzoom: {
    description: <Typography>Define the min zoom level of the map.</Typography>,
    props: {
      slotProps: {
        input: {
          max: 22,
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
        Commas separated list of mots to display on the Realtime layer (rail,
        bus, coach, foot, tram, subway, gondola, funicular, ferry, car).
      </Typography>
    ),
    type: "textfield",
  },
  notification: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the notification layer or not (true or false).
      </Typography>
    ),
    type: "checkbox",
  },
  notificationat: {
    description: (
      <Typography>
        An ISO date string used to display active notification at this date in
        the notification layer.
      </Typography>
    ),
    type: "textfield",
  },
  notificationbeforelayerid: {
    description: (
      <Typography>
        The style layer&apos;s id before which the notification layer will be
        added. By default the layer will be added on top.
      </Typography>
    ),
    type: "textfield",
  },
  notificationurl: {
    description: (
      <Typography>
        The MOCO notification url to get the notifications from.
      </Typography>
    ),
    type: "textfield",
  },
  // x,y,z are not applies on refresh
  // permalink: {
  //   defaultValue: "false",
  //   description: (
  //     <Typography>
  //       Add automatically an `x`,`y` an `z` URL parameters to the URL to allow
  //       to share the current mapview. Default to false.
  //     </Typography>
  //   ),
  //   type: "checkbox",
  // },
  realtime: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the realtime layer or not (true or false).
      </Typography>
    ),
    type: "checkbox",
  },
  realtimeurl: {
    defaultValue: "wss://api.geops.io/tracker-ws/v1/ws",
    description: (
      <Typography>
        The{" "}
        <a
          href="https://developer.geops.io/apis/realtime"
          rel="noreferrer"
          target="_blank"
        >
          geOps Realtime API
        </a>{" "}
        url to use.
      </Typography>
    ),
    type: "textfield",
  },
  search: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the search stops input or not (true or false).
      </Typography>
    ),
    type: "checkbox",
  },
  stopsurl: {
    defaultValue: "https://api.geops.io/stops/v1/",
    description: (
      <Typography>
        The{" "}
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
  tenant: {
    description: (
      <Typography>
        The tenant name to use to filter the Realtime vehicles available.
      </Typography>
    ),
    type: "textfield",
  },
  zoom: {
    defaultValue: "13",
    description: <Typography>The initial zoom level of the map.</Typography>,
    props: {
      slotProps: {
        input: {
          max: 22,
          min: 0,
          step: 1,
        },
      },
      type: "number",
    },
    type: "textfield",
  },
};
function GeopsMobilityDoc() {
  return (
    <Suspense>
      <WebComponentDoc
        attrsConfig={attrsConfig}
        // @ts-expect-error -  must find the correct type
        Comp={GeopsMobility}
        tagName="geops-mobility"
      />
    </Suspense>
  );
}

export default GeopsMobilityDoc;
