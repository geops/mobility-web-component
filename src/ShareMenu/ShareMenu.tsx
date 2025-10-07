import CanvasSaveButton from "react-spatial/components/CanvasSaveButton";
import { twMerge } from "tailwind-merge";

import Email from "../icons/Email";
import Image from "../icons/Image";
import PermalinkInput from "../PermalinkInput";
import Button from "../ui/Button";
import useI18n from "../utils/hooks/useI18n";
import useMapContext from "../utils/hooks/useMapContext";

import type { HTMLAttributes, PreactDOMAttributes } from "preact";

function ShareMenu({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & PreactDOMAttributes) {
  const { map } = useMapContext();
  const { t } = useI18n();

  return (
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    <div className={twMerge(`flex flex-col gap-4 ${className}`)} {...props}>
      <Button
        className="w-fit"
        href={`mailto:?subject=Karte&body=${window?.location.href}`}
      >
        <Email />
        <span>{t("share_email_send")}</span>
      </Button>
      <CanvasSaveButton map={map}>
        <Button className={"w-fit"}>
          <Image />
          <span>{t("share_image_save")}</span>
        </Button>
      </CanvasSaveButton>
      <PermalinkInput />
    </div>
  );
}

export default ShareMenu;
