import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import { twMerge } from "tailwind-merge";

import Email from "../icons/Email";
import Image from "../icons/Image";
import PermalinkInput from "../PermalinkInput";
import Button from "../ui/Button";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

function ShareMenu({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & PreactDOMAttributes) {
  const { map } = useMapContext();

  return (
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    <div className={twMerge(`flex flex-col gap-4 ${className}`)} {...props}>
      <a
        className="flex items-center gap-2"
        href={`mailto:?subject=Karte&body=${window?.location.href}`}
      >
        <Button>
          <Email />
          <span>Email senden</span>
        </Button>
      </a>
      <CanvasSaveButton map={map}>
        <Button className={"w-fit"}>
          <Image />
          <span>Bild speichern</span>
        </Button>
      </CanvasSaveButton>
      <PermalinkInput />
    </div>
  );
}

export default ShareMenu;
