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
import { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";

import useAttrFromUrlParams from "../hooks/useAttrFromUrlParams";
import usePublicKey from "../hooks/usePublicKey";

type GeopsMobilitySearchAttributes =
  | "apikey"
  | "bbox"
  | "limit"
  | "mots"
  | "url";

interface AttrConfig {
  defaultValue?: string;
  description: ReactNode;
  props?: TextFieldProps;
  type: "checkbox" | "date" | "select" | "textfield";
}

const wcAttributes: GeopsMobilitySearchAttributes[] = [
  "apikey",
  "bbox",
  "limit",
  "mots",
  "url",
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
    description: (
      <Typography>The number of suggestions to show. Default to 5.</Typography>
    ),
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
        url to use. Default to `https://api.geops.io/stops/v1/`.
      </Typography>
    ),
    type: "textfield",
  },
};

function GeopsMobilitySearchDoc() {
  const refSearch = useRef<HTMLPreElement>(null);
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
<geops-mobility-search`;

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

    str += `>\n</geops-mobility-search>`;

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
  console.log(refSearch.current);

  useEffect(() => {
    if (refSearch.current) {
      // Listen to element event
      // @ts-expect-error - strange error
      refSearch.current?.addEventListener(
        "mwc:stopssearchselect",
        (event: CustomEvent<{ data: object; type: string }>) => {
          const eventLog = document.getElementById("textarea");
          // @ts-expect-error - strange error
          const data = event.data;
          if (!eventLog) {
            return;
          }
          if (!data) {
            eventLog.innerText = "";
          } else {
            eventLog.innerText =
              "Event " +
              event.type +
              " received :\n " +
              JSON.stringify(data, undefined, " ");
            // window.top.postMessage(data, "*");
          }
        },
      );
    }
  }, []);

  return (
    <div className="scroll-mt-20" id="geops-mobility-search-web-component">
      <Typography
        className="mb-8 mt-16"
        variant="h2"
      >{`<geops-mobility-search/>`}</Typography>
      <geops-mobility-search
        apikey={apiKey}
        class="block max-w-3xl border"
        ref={(node: HTMLPreElement) => {
          // @ts-expect-error - strange error
          refSearch.current = node;
        }}
      ></geops-mobility-search>
      <Typography className="my-8  overflow-auto" variant="h3">
        Event received
      </Typography>
      <pre className="h-40 w-full overflow-auto p-2" id="textarea"></pre>
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

export default GeopsMobilitySearchDoc;
