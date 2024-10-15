"use client;";
import "@geops/mobility-web-component";
import {
  Button,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useCallback, useMemo } from "react";

import useAttrFromUrlParams from "../hooks/useAttrFromUrlParams";
import usePublicKey from "../hooks/usePublicKey";

type GeopsMobilityAttributes =
  | "apikey"
  | "baselayer"
  | "center"
  | "geolocation"
  | "mapsurl"
  | "maxzoom"
  | "minzoom"
  | "mots"
  | "notification"
  | "notificationat"
  | "notificationbeforelayerid"
  | "notificationurl"
  | "permalink"
  | "realtime"
  | "realtimeurl"
  | "search"
  | "stopsurl"
  | "tenant"
  | "zoom";

interface AttrConfig {
  defaultValue?: string;
  description: ReactNode;
  props?: TextFieldProps;
  type: "checkbox" | "date" | "select" | "textfield";
}

const wcAttributes: GeopsMobilityAttributes[] = [
  "apikey",
  "baselayer",
  "center",
  "geolocation",
  "mapsurl",
  "stopsurl",
  "maxzoom",
  "minzoom",
  "mots",
  "notification",
  "notificationat",
  "notificationurl",
  "notificationbeforelayerid",
  "realtime",
  "realtimeurl",
  "search",
  "tenant",
  "zoom",
  "permalink",
];

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
        (base_dark_v2, base_bright_v2, ...). Default to `travic_v2`.
      </Typography>
    ),
    type: "select",
  },
  center: {
    defaultValue: "831634,5933959",
    description: (
      <Typography>
        the center of the map in EPSG:3857 coordinates. Default to
        `831634,5933959` (Bern).
      </Typography>
    ),
    type: "textfield",
  },
  geolocation: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the geolocation button or not (true or false). Default to true.
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
        url to use. Default to `https://maps.geops.io`.
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
        Display the notification layer or not (true or false). Default to true.
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
        Display the realtime layer or not (true or false). Default to true.
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
        url to use. Default to `wss://api.geops.io/tracker-ws/v1/ws`.
      </Typography>
    ),
    type: "textfield",
  },
  search: {
    defaultValue: "true",
    description: (
      <Typography>
        Display the search stops input or not (true or false). Default to true.
      </Typography>
    ),
    type: "checkbox",
  },
  stopsurl: {
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
        url to use. Default to `https://api.geops.io/stops/v1/`.
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
    description: (
      <Typography>the zoom level of the map. Default to 13.</Typography>
    ),
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
  const router = useRouter();
  const pathname = usePathname();
  const apiKey = usePublicKey();
  const attributes = useAttrFromUrlParams(wcAttributes);
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams],
  );

  const code = useMemo(() => {
    let str = `<script\n\ttype="module"\n\tsrc="https://www.unpkg.com/@geops/mobility-web-component">
</script>
<geops-mobility`;

    // attributes.forEach((key) => {
    //   if (key == "apikey") {
    //     codeText += `\n\tapikey="YOUR_GEOPS_API_KEY"`;
    //   } else if (map.getAttribute(key) !== null) {
    //     codeText += `\n\t${[key, '"' + map.getAttribute(key) + '"'].join("=")}`;
    //   } else if (key == "center") {
    //     codeText += `\n\tcenter="831634,5933959"`;
    //   } else if (key == "zoom") {
    //     codeText += `\n\tzoom="13"`;
    //   } else if (key == "baselayer") {
    //     codeText += `\n\tbaselayer="travic_v2"`;
    //   }
    // });

    str = Object.keys(attributes).reduce((acc, key) => {
      if (key === "apikey" && !attributes[key]) {
        return `${acc}\n\tapikey="YOUR_GEOPS_API_KEY"`;
      }
      return `${acc}\n\t${key}="${attributes[key]}"`;
    }, str);

    str += `>\n</geops-mobility>`;

    return str;
  }, [attributes]);

  const onChange = useCallback(
    (key: string, value: string) => {
      const val = value === attrsConfig[key]?.defaultValue ? undefined : value;
      router.push(pathname + "?" + createQueryString(key, val), {
        scroll: false,
      });
    },
    [createQueryString, pathname, router],
  );

  return (
    <div className="scroll-mt-20" id="geops-mobility-web-component">
      <Typography
        className="mb-8 mt-16"
        variant="h2"
      >{`<geops-mobility/>`}</Typography>
      <geops-mobility
        apikey={apiKey}
        class="block h-96 max-w-full resize overflow-auto"
        {...attributes}
      ></geops-mobility>
      <Typography className="my-8" variant="h3">
        HTML code
      </Typography>
      <pre className="rounded bg-slate-800 p-4 text-slate-200">{code}</pre>
      <Typography className="my-8" variant="h3">
        Attributes
      </Typography>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="w-4 border px-4 py-2">Name</th>
            <th className="w-8 border px-4 py-2">Value</th>
            <th className="w-12 border px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {wcAttributes
            .sort((a, b) => {
              return a < b ? -1 : 1;
            })
            .filter((key) => {
              return attrsConfig[key]?.description;
            })
            .map((key) => {
              const {
                defaultValue,
                description,
                props = {},
                type,
              } = attrsConfig[key] || {};
              return (
                <tr key={key}>
                  <td className="w-4 border px-4 py-2">{key}</td>
                  <td className="w-8 border px-4 py-2">
                    {type === "textfield" && (
                      <div className="flex gap-2">
                        <TextField
                          defaultValue={attributes[key]}
                          id={key}
                          placeholder={defaultValue}
                          {...props}
                        />
                        <Button
                          onClick={() => {
                            onChange(
                              key,
                              (document.getElementById(key) as HTMLInputElement)
                                ?.value,
                            );
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    )}

                    {type === "checkbox" && (
                      <Checkbox
                        defaultChecked={
                          (searchParams.get(key) || defaultValue) === "true"
                        }
                        onChange={(evt) => {
                          onChange(key, evt.target.checked ? "true" : "false");
                        }}
                      />
                    )}

                    {type === "select" && (
                      <Select
                        defaultValue={searchParams.get(key) || defaultValue}
                        onChange={(evt) => {
                          onChange(key, evt.target.value);
                        }}
                      >
                        <MenuItem value="travic_v2">Travic v2</MenuItem>
                        <MenuItem value="base_dark_v2">Dark v2</MenuItem>
                      </Select>
                    )}
                  </td>
                  <td className="w-12 border px-4 py-2">{description}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default GeopsMobilityDoc;
