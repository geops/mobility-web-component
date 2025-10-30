import { memo } from "preact/compat";
import { useRef } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import Cancel from "../../icons/Cancel";
import Search from "../../icons/Search";
import useI18n from "../../utils/hooks/useI18n";
import IconButton from "../IconButton";
import Input from "../Input";

import type { PreactDOMAttributes } from "preact";
import type { HTMLAttributes } from "preact/compat";

import type { IconButtonProps } from "../IconButton/IconButton";
import type { InputProps } from "../Input/Input";

export type InputSearchProps = {
  cancelButtonClassName?: string;
  cancelButtonProps?: IconButtonProps;
  className?: string;
  inputClassName?: string;
  inputContainerClassName?: string;
  inputProps?: InputProps;
  resultClassName?: string;
  resultsClassName?: string;
  resultsContainerClassName?: string;
  searchIconContainerClassName?: string;
  withResultsClassName?: string;
} & HTMLAttributes<HTMLDivElement> &
  PreactDOMAttributes;

/**
 * Rich search input component.
 */
function InputSearch({
  cancelButtonClassName,
  cancelButtonProps,
  children,
  className,
  inputClassName,
  inputContainerClassName,
  inputProps,
  searchIconContainerClassName,
  withResultsClassName,
}: InputSearchProps) {
  const { t } = useI18n();
  const myRef = useRef<HTMLDivElement>();

  return (
    <>
      <div
        className={twMerge(
          "flex h-16 items-center gap-4 rounded-md bg-white p-4 pt-3.5 shadow",
          className,
          withResultsClassName,
        )}
        ref={myRef}
      >
        <div
          className={twMerge(
            "text-grey flex items-center",
            searchIconContainerClassName,
          )}
        >
          <Search className="size-4" />
        </div>
        <div
          className={twMerge(
            "@container/inputsearch flex grow items-center border-b-2 border-solid",
            inputContainerClassName,
          )}
        >
          <Input
            autoComplete="off"
            className={twMerge(
              "h-8 w-1 grow overflow-hidden text-ellipsis placeholder:text-zinc-400",
              inputClassName,
            )}
            type="text"
            {...(inputProps || {})}
          />
          {!!inputProps.value && (
            <IconButton
              className={twMerge(
                "flex !size-[32px] items-center rounded-none border-none bg-transparent shadow-none",
                cancelButtonClassName,
              )}
              title={t("search_input_cancel")}
              {...(cancelButtonProps || {})}
            >
              <Cancel />
            </IconButton>
          )}
        </div>
      </div>
      {children}
    </>
  );
}

export default memo(InputSearch);
