"use client";
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
import {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import useAttrFromUrlParams from "../hooks/useAttrFromUrlParams";
import usePublicKey from "../hooks/usePublicKey";

export interface AttrConfig {
  defaultValue?: string;
  description: ReactNode;
  props?: TextFieldProps;
  type: "checkbox" | "date" | "select" | "textfield";
}

function WebComponentDoc({
  attrsConfig,
  Comp,
  events,
  tagName,
}: {
  attrsConfig: Record<string, AttrConfig>;
  Comp: (props: Record<string, string>) => ReactElement;
  events?: string[];
  tagName: string;
}) {
  const wcAttributes = Object.keys(attrsConfig);
  const ref = useRef<HTMLElement>(null);
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
<${tagName}`;

    str = Object.keys({ apikey: "", ...attributes }).reduce((acc, key) => {
      if (key === "apikey" && !attributes[key]) {
        return `${acc}\n\tapikey="YOUR_GEOPS_API_KEY"`;
      }
      return `${acc}\n\t${key}="${attributes[key]}"`;
    }, str);

    str += `>\n</${tagName}>`;

    return str;
  }, [attributes, tagName]);

  const onChange = useCallback(
    (key: string, value: string) => {
      const val = value === attrsConfig[key]?.defaultValue ? undefined : value;
      router.replace(pathname + "?" + createQueryString(key, val), {
        scroll: false,
      });
    },
    [attrsConfig, createQueryString, pathname, router],
  );

  useEffect(() => {
    const cb = (event: CustomEvent<{ data: object; type: string }>) => {
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
    };
    if (ref.current) {
      // Listen to element event
      events?.forEach((event) => {
        // @ts-expect-error - strange error
        ref.current?.addEventListener(event, cb);
      });
    }
    return () => {
      events?.forEach((event) => {
        // @ts-expect-error - strange error
        ref.current?.removeEventListener(event, cb);
      });
    };
  }, [events]);

  console.log(attributes);
  return (
    <div className="mb-48 scroll-mt-20">
      <Typography variant="h1">{`<${tagName} />`}</Typography>
      <br />
      <Typography>
        This is a demo of the &lt;{tagName} /&gt; Web Component.
      </Typography>
      <br />
      {
        <Comp
          // @ts-expect-error - strange error
          apikey={apiKey}
          {...attributes}
          // @ts-expect-error - strange error
          ref={(node: HTMLElement) => {
            // @ts-expect-error - strange error
            ref.current = node;
          }}
        />
      }
      <br />
      {events?.length && (
        <>
          <Typography className="my-8  overflow-auto" variant="h3">
            Event received
          </Typography>
          <pre
            className="h-40 w-full overflow-auto border p-2"
            id="textarea"
          ></pre>
          <br />
        </>
      )}
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
                      <div>
                        <TextField
                          defaultValue={attributes[key]}
                          fullWidth
                          id={key}
                          placeholder={defaultValue}
                          variant="standard"
                          {...props}
                        />
                        <div className="mt-2">
                          <Button
                            fullWidth
                            onClick={() => {
                              onChange(
                                key,
                                (
                                  document.getElementById(
                                    key,
                                  ) as HTMLInputElement
                                )?.value,
                              );
                            }}
                          >
                            Apply
                          </Button>
                        </div>
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
                        fullWidth
                        onChange={(evt) => {
                          onChange(key, evt.target.value);
                        }}
                        variant="standard"
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

export default WebComponentDoc;
