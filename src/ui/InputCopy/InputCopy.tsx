import { useId, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import Copy from "../../icons/Copy";
import useI18n from "../../utils/hooks/useI18n";
import IconButton from "../IconButton";
import Input from "../Input";

import type {
  HTMLAttributes,
  InputHTMLAttributes,
  PreactDOMAttributes,
} from "preact";

export type InputCopyProps = {
  containerProps?: HTMLAttributes<HTMLDivElement> & PreactDOMAttributes;
  tooltipProps?: HTMLAttributes<HTMLDivElement> & PreactDOMAttributes;
} & InputHTMLAttributes &
  PreactDOMAttributes;

const emptyProps = {}; // avoid re-rendering

function InputCopy({
  containerProps = emptyProps,
  tooltipProps = emptyProps,
  ...props
}: InputCopyProps) {
  const { t } = useI18n();
  const [positionTooltip, setPositionTooltip] = useState<DOMRect>();
  const [isTooptipShowed, setIsTooltipShowed] = useState(false);
  const inputId = useId();
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const handleCopyClick = (event) => {
    setPositionTooltip(event.currentTarget.getBoundingClientRect());
    const input: HTMLInputElement | null = node.querySelector(`#${inputId}`);
    void navigator.clipboard.writeText(input?.value).then(() => {
      setIsTooltipShowed(true);
      setTimeout(() => {
        setIsTooltipShowed(false);
      }, 1000);
    });
    input?.select();
  };

  const handleInputFocus = () => {
    const input: HTMLInputElement | null = node.querySelector(`#${inputId}`);
    input?.select();
  };

  return (
    <div
      ref={(elt) => {
        setNode(elt);
      }}
      {...containerProps}
      className={twMerge(
        "relative flex h-7 items-center",
        containerProps?.className as string,
      )}
    >
      <Input
        id={inputId}
        onFocus={handleInputFocus}
        readOnly
        type="text"
        {...props}
        className={twMerge(
          "h-7 flex-1 border border-r-0",
          props?.className as string,
        )}
      />
      <IconButton
        className="size-7 rounded-none border p-2 shadow-none"
        onClick={handleCopyClick}
      >
        <Copy size={20} />
      </IconButton>
      <div
        {...tooltipProps}
        className={twMerge(
          `fixed hidden rounded bg-gray-600 p-1 text-sm text-white`,
          isTooptipShowed && "block",
          tooltipProps?.className as string,
        )}
        style={{
          left: positionTooltip?.left - 30,
          top: positionTooltip?.top - 30,
        }}
      >
        {t("input_copy_success")}!
      </div>
    </div>
  );
}

export default InputCopy;
