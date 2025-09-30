import InputCopy from "../ui/InputCopy";

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
  return (
    <div {...props}>
      <InputCopy value={window?.location.href} {...inputProps} />
      <p className="py-2">
        Sie können auch den Link aus der Adresszeile des Browsers kopieren.
      </p>
    </div>
  );
}

export default PermalinkInput;
