import { useState } from "preact/hooks";

import Cancel from "../../icons/Cancel";
import ShareMenu from "../../icons/ShareMenu";
import RvfInputCopy from "../../RvfInputCopy";
import IconButton from "../../ui/IconButton";

import type { ButtonHTMLAttributes, PreactDOMAttributes } from "preact";

function PermalinkButton({
  className,
  ...props
}: { className?: string } & ButtonHTMLAttributes<HTMLButtonElement> &
  PreactDOMAttributes) {
  const [showTooltip, setShowTooltip] = useState(null);
  const [positionTooltip, setPositionTooltip] = useState<DOMRect>();

  const handleIconClick = (event) => {
    setPositionTooltip(event.currentTarget.getBoundingClientRect());
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <IconButton
        className={`border-none ${className}`}
        onClick={handleIconClick}
        selected={showTooltip}
        {...props}
      >
        <ShareMenu />
      </IconButton>

      {showTooltip && positionTooltip && (
        <div
          className="border-grey fixed rounded-lg border bg-white p-2 shadow-lg"
          style={{
            left: positionTooltip.left + 40,
            top: positionTooltip.top - 10,
          }}
        >
          <div className="pr-4">
            <IconButton
              className="absolute top-[-5px] right-[-5px] border-none bg-transparent p-0"
              onClick={handleIconClick}
            >
              <Cancel height="18px" width="18px" />
            </IconButton>
            <RvfInputCopy />
            <p className="py-2">
              Sie können auch den Link aus der Adresszeile des Browsers
              kopieren.
            </p>
          </div>
          <div className="border-grey absolute top-4 -left-1.5 size-2.5 rotate-45 border border-t-0 border-r-0 bg-white"></div>
        </div>
      )}
    </>
  );
}

export default PermalinkButton;
