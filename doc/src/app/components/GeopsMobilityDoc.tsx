"use client";
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

    str = Object.keys({ apikey: "", ...attributes }).reduce((acc, key) => {
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
      <Typography variant="h1">{`<geops-mobility />`}</Typography>
      <br />
      <Typography>
        This is a demo of the &lt;geops-mobility /&gt; Web Component.
      </Typography>
      <br />
      <geops-mobility
        apikey={apiKey}
        class="block h-96 max-w-full resize overflow-auto"
        {...attributes}
      ></geops-mobility>
      <br />

      <Typography className="my-8" variant="h2">
        HTML code
      </Typography>
      <br />

      <pre className="rounded bg-slate-800 p-4 text-slate-200">{code}</pre>
      <br />

      <Typography className="flex gap-4" variant="h2">
        Attributes
        <Button
          onClick={() => {
            router.push(pathname, {
              scroll: false,
            });
          }}
        >
          Reset
        </Button>
      </Typography>
      <br />

      <table className="w-full">
        <thead>
          <tr>
            <th className="w-[15%] border px-4 py-2">Name</th>
            <th className="w-2/5 border px-4 py-2">Value</th>
            <th className="w-[45%] border px-4 py-2">Description</th>
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
                  <td className="border px-4 py-2">{key}</td>
                  <td className="border px-4 py-2">
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
                  <td className="border p-4">
                    {description}{" "}
                    {defaultValue && (
                      <>
                        <br />
                        <i>Default to &quot;{defaultValue}&quot;</i>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default GeopsMobilityDoc;
