import { memo } from "preact/compat";

import InputCopy from "../ui/InputCopy";
import useI18n from "../utils/hooks/useI18n";
import usePermalink from "../utils/hooks/usePermalink";

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
  const permalink = usePermalink();

  return (
    <div {...props}>
      <InputCopy value={permalink} {...inputProps} readonly={true} />
      <p className="py-2">{t("permalink_input_hint")}</p>
    </div>
  );
}

export default memo(PermalinkInput);
