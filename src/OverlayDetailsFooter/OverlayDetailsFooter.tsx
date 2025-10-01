import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import ArrowRight from "../icons/ArrowRight";
import Button from "../ui/Button";
import useLayerConfig from "../utils/hooks/useLayerConfig";

import type { Feature } from "ol";
import type BaseLayer from "ol/layer/Base";
import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type OverlayDetailsFooterProps = {
  className?: string;
  feature?: Feature;
  layer?: BaseLayer;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

function OverlayDetailsFooter({
  className,
  feature,
  layer,
  ...props
}: OverlayDetailsFooterProps) {
  const layerConfig = useLayerConfig(layer?.get("name"));

  if (!layerConfig?.link || layerConfig?.link?.show === false) {
    return null;
  }

  let id = feature?.get("id");
  const situation = feature?.get("situation");
  if (situation) {
    const situationParsed = JSON.parse(situation);
    id = situationParsed?.id || id;
  }
  return (
    <div {...props} className={twMerge("flex flex-row p-4", className)}>
      <Button
        href={layerConfig.link.href.replace("{{id}}", id)}
        target="_blank"
        theme="primary"
      >
        <span>{layerConfig.link.text || "Mehr erfahren"}</span>
        <ArrowRight />
      </Button>
    </div>
  );
}

export default memo(OverlayDetailsFooter);
