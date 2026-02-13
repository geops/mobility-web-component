import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import Tracking from "../icons/Tracking";
import IconButton from "../ui/IconButton";
import useMapContext from "../utils/hooks/useMapContext";

import type { IconButtonProps } from "../ui/IconButton/IconButton";

function RouteFollowingButton({
  children,
  className,
  ...props
}: IconButtonProps) {
  const { isFollowing, setIsFollowing } = useMapContext();
  return (
    <IconButton
      className={twMerge(`${isFollowing ? "animate-pulse" : ""}`, className)}
      onClick={() => {
        setIsFollowing(!isFollowing);
      }}
      selected={isFollowing}
      {...props}
    >
      {children || <Tracking />}
    </IconButton>
  );
}

export default memo(RouteFollowingButton);
