"use client";
import {
  Button,
  Checkbox,
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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import useAttrFromUrlParams from "../hooks/useAttrFromUrlParams";
import usePublicKey from "../hooks/usePublicKey";

export interface AttrConfig {
  defaultValue?: string;
  description: ReactNode;
  props?: TextFieldProps;
  type?: "boolean";
}

function WebComponentDoc({
  attrsConfig,
  Comp,
  compProps,
  events,
  isFullScreen,
  tagName,
}: {
  attrsConfig: Record<string, AttrConfig>;
  Comp: (props: Record<string, string>) => ReactElement;
  compProps: Record<string, string>;
  events?: string[];
  isFullScreen?: boolean;
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

  const webComponent = useMemo(() => {
    return (
      <Comp
        // @ts-expect-error - strange error
        apikey={apiKey}
        {...attributes}
        // @ts-expect-error - strange error
        ref={(node: HTMLElement) => {
          ref.current = node;
        }}
        {...compProps}
      />
    );
  }, [Comp, apiKey, attributes, compProps]);

  if (isFullScreen) {
    return webComponent;
  }

  return (
    <div className="mb-48 scroll-mt-20">
      <Typography variant="h1">{`<${tagName} />`}</Typography>
      <br />
      <Typography>
        This is a demo of the &lt;{tagName} /&gt; Web Component.
      </Typography>
      <br />
      {webComponent}
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
      <SyntaxHighlighter className="m-0!" language="xml">
        {code}
      </SyntaxHighlighter>
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
            <th className="w-1/5 border px-4 py-2">Name</th>
            <th className="w-4/5 border px-4 py-2">Description</th>
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
                  <td className="w-1/5 border p-4">{key}</td>
                  <td className="w-2/5 border p-4">
                    <div className="flex flex-col gap-4 justify-start">
                      {!type && (
                        <div className="flex gap-2">
                          <TextField
                            defaultValue={attributes[key]}
                            id={key}
                            placeholder={defaultValue}
                            variant="outlined"
                            {...props}
                          />
                          <Button
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
                      )}
                      {type === "boolean" && (
                        <Checkbox
                          className="w-8"
                          defaultChecked={
                            (searchParams.get(key) || defaultValue) === "true"
                          }
                          onChange={(evt) => {
                            onChange(
                              key,
                              evt.target.checked ? "true" : "false",
                            );
                          }}
                        />
                      )}
                      <div>
                        {typeof description !== "string" ? (
                          description
                        ) : (
                          <Typography
                            dangerouslySetInnerHTML={{ __html: description }}
                          />
                        )}{" "}
                        {defaultValue && (
                          <>
                            <i>Default to &quot;{defaultValue}&quot;</i>
                          </>
                        )}
                      </div>
                    </div>
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
