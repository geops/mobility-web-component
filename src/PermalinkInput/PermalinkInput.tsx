import { memo } from "preact/compat";

import InputCopy from "../ui/InputCopy";
import useI18n from "../utils/hooks/useI18n";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

import type { InputCopyProps } from "../ui/InputCopy/InputCopy";

export type PermalinkInputProps = {
  inputProps?: InputCopyProps;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

const emptyProps = {}; // avoid re-rendering

function PermalinkInput({
  inputProps = emptyProps,
  ...props
}: PermalinkInputProps) {
  const { t } = useI18n();
  return (
    <div {...props}>
      <InputCopy value={window?.location.href} {...inputProps} />
      <p className="py-2">{t("permalink_input_hint")}</p>
    </div>
  );
}

export default memo(PermalinkInput);
