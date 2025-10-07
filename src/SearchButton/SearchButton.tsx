import { memo } from "preact/compat";
import { useCallback } from "preact/hooks";

import Search from "../icons/Search";
import IconButton from "../ui/IconButton";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { IconButtonProps } from "../ui/IconButton/IconButton";

export type SearchButtonProps = IconButtonProps;

function SearchButton({ ...props }: SearchButtonProps) {
  const { isSearchOpen, setIsSearchOpen } = useMapContext();
  const { t } = useI18n();

  const onClick = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
  }, [isSearchOpen, setIsSearchOpen]);

  return (
    <IconButton
      title={t("search_menu_title")}
      {...props}
      onClick={onClick}
      selected={isSearchOpen}
    >
      <Search />
    </IconButton>
  );
}

export default memo(SearchButton);
