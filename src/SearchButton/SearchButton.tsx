import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Search from "../icons/Search";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

export type SearchButtonProps = HTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes;

function SearchButton({ ...props }: SearchButtonProps) {
  const { isSearchOpen, setIsSearchOpen } = useMapContext();

  const onClick = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
  }, [isSearchOpen, setIsSearchOpen]);

  return (
    <IconButton {...props} onClick={onClick} selected={isSearchOpen}>
      <Search />
    </IconButton>
  );
}

export default memo(SearchButton);
