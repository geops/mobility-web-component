import { memo } from "preact/compat";
import { twMerge } from "tailwind-merge";

import Copyright from "../Copyright";
import EmbedNavigation from "../EmbedNavigation";
import ExportMenuButton from "../ExportMenuButton";
import GeolocationButton from "../GeolocationButton";
import LayerTreeButton from "../LayerTreeButton";
import Map from "../Map";
import Overlay from "../Overlay";
import OverlayContent from "../OverlayContent";
import ScaleLine from "../ScaleLine";
import Search from "../Search";
import SearchButton from "../SearchButton";
import ShareMenuButton from "../ShareMenuButton";
import useMapContext from "../utils/hooks/useMapContext";
import ZoomButtons from "../ZoomButtons";

import type { HTMLAttributes } from "preact";

const scrollableHandlerProps = {
  style: { width: "calc(100% - 60px)" },
};

function MapLayout({
  className,
  ...props
}: { className?: string } & HTMLAttributes<HTMLDivElement>) {
  const {
    hasDetails,
    hasGeolocation,
    hasLayerTree,
    hasPrint,
    hasRealtime,
    hasSearch,
    hasShare,
    hasToolbar,
    isEmbed,
    isOverlayOpen,
    isSearchOpen,
  } = useMapContext();

  return (
    <div
      className={twMerge(
        "relative flex size-full flex-col @lg/main:flex-row-reverse",
        className,
      )}
      {...props}
    >
      <Map className="relative flex-1 overflow-visible">
        {isEmbed && <EmbedNavigation />}

        <div className="absolute inset-x-2 bottom-2 z-10 flex items-end justify-between gap-2 text-[10px]">
          <ScaleLine className="bg-slate-50/70" />
          <Copyright className="bg-slate-50/70" />
        </div>

        <div className="absolute right-2 bottom-10 z-10 flex flex-col justify-between gap-2">
          <ZoomButtons />
        </div>

        {hasGeolocation && (
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
            <GeolocationButton />
          </div>
        )}

        {!hasToolbar && hasSearch && (
          <div
            className={twMerge(
              "absolute top-2 right-2 left-2 z-10 max-w-96",
              isOverlayOpen && "@lg:left-84",
            )}
          >
            <Search />
          </div>
        )}
      </Map>

      <div className="pointer-events-none absolute top-2 bottom-2 left-2 z-10 flex flex-col gap-2">
        {hasToolbar && (
          <div
            className={
              "pointer-events-none relative z-10 w-fit rounded-2xl bg-black/10 p-0 backdrop-blur-sm *:pointer-events-auto"
            }
          >
            <div
              className={twMerge(
                "border-grey relative z-10 flex h-[48px] gap-[1px] overflow-hidden rounded-2xl border",
                "*:size-[46px] *:rounded-none *:border-none",
                "*:first:!rounded-l-2xl",
                "*:last:!rounded-r-2xl",
                isSearchOpen
                  ? "@sm:rounded-r-none @sm:border-r-0 @sm:*:last:!rounded-r-none @sm:*:last:border-r-0"
                  : "",
              )}
            >
              {hasPrint && <ExportMenuButton />}
              {hasShare && <ShareMenuButton />}
              {hasLayerTree && <LayerTreeButton />}
              {hasSearch && <SearchButton />}
            </div>

            {hasSearch && isSearchOpen && (
              <div
                className={twMerge(
                  "absolute top-14 left-0 z-5 w-0 p-0 opacity-0 transition-all @sm:top-0 @sm:left-[calc(100%-47px)]",
                  isSearchOpen ? "w-64 opacity-100" : "",
                )}
              >
                <Search
                  autofocus
                  className={
                    "@container @sm/main:gap-4 @sm/main:rounded-l-none @sm/main:rounded-r-2xl"
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Desktop (>= lg) */}
        {isOverlayOpen && (
          <div
            className={twMerge(
              "flex w-0 flex-1 flex-col overflow-hidden rounded-2xl @lg:min-w-[320px]",
            )}
            style={{ containerType: "normal" }}
          >
            <Overlay
              className={
                "border-grey @container/overlay pointer-events-auto relative hidden flex-col overflow-hidden rounded-2xl border bg-white text-base shadow-lg @lg:flex"
              }
              ScrollableHandlerProps={scrollableHandlerProps}
            >
              <OverlayContent
                hasDetails={hasDetails}
                hasLayerTree={hasLayerTree}
                hasPrint={hasPrint}
                hasRealtime={hasRealtime}
                hasSearch={false}
                hasShare={hasShare}
              />
            </Overlay>
          </div>
        )}
      </div>

      {/* Mobile (< lg) */}
      {isOverlayOpen && (
        <Overlay
          className={
            "absolute bottom-0 z-20 flex max-h-[70%] min-h-[75px] w-full flex-col border-t bg-white @lg:hidden"
          }
          ScrollableHandlerProps={scrollableHandlerProps}
        >
          <OverlayContent
            hasDetails={hasDetails}
            hasLayerTree={hasLayerTree}
            hasPrint={hasPrint}
            hasRealtime={hasRealtime}
            hasSearch={false}
            hasShare={hasShare}
          />
        </Overlay>
      )}
    </div>
  );
}

export default memo(MapLayout);
