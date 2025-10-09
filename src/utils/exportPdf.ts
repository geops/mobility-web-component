import jsPDF from "jspdf";
import { CopyrightControl } from "mobility-toolbox-js/ol";
import { Map } from "ol";
import { getBottomRight, getTopLeft } from "ol/extent";
import View from "ol/View";

import { EXPORT_PREFIX } from "./constants";

import type { jsPDFOptions } from "jspdf";
import type { Coordinate } from "ol/coordinate";
import type { Extent } from "ol/extent";
import type BaseLayer from "ol/layer/Base";
import type { MapOptions } from "ol/Map";
import type { Size } from "ol/size";
import type { ViewOptions } from "ol/View";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMargin = (destCanvas) => {
  const newMargin = destCanvas.width / 100; // 1% of the canvas width
  return newMargin;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDefaultDownloadImageName = (format) => {
  const fileExt = format === "image/jpeg" ? "jpg" : "png";
  return `${window.document.title.replace(/ /g, "_").toLowerCase()}.${fileExt}`;
};

let multilineCopyright = false;
const copyrightY = 0;

// Ensure the font size fita with the image width.
const decreaseFontSize = (destContext, maxWidth, copyright, scale = 1) => {
  const minFontSize = 8;
  let sizeMatch;
  let fontSize;
  do {
    sizeMatch = destContext.font.match(/[0-9]+(?:\.[0-9]+)?(px)/i);
    fontSize = parseInt(sizeMatch[0].replace(sizeMatch[1], ""), 10);

    destContext.font = destContext.font.replace(fontSize, fontSize - 1);

    multilineCopyright = false;

    if (fontSize - 1 === minFontSize) {
      multilineCopyright = true;
    }
  } while (
    fontSize - 1 > minFontSize &&
    destContext.measureText(copyright).width * scale > maxWidth
  );

  return destContext.font;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawTextBackground = (
  destContext,
  x,
  y,
  width,
  height,
  styleOptions = {},
) => {
  destContext.save();
  // Dflt is a white background
  destContext.fillStyle = "rgba(255,255,255,.8)";

  // To simplify usability the user could pass a boolean to use only default values.
  if (typeof styleOptions === "object") {
    Object.entries(styleOptions).forEach(([key, value]) => {
      destContext[key] = value;
    });
  }

  /// draw background rect assuming height of font
  destContext.fillRect(x, y, width, height);
  destContext.restore();
};

export interface DrawCopyrightOptions {
  background?: boolean;
  fillStyle?: string;
  font?: string;
  margin?: number;
  maxWidth?: number;
  padding?: number;
  placement?: Placement;
  scale?: number;
}

export type Placement =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

// Remove all transparent pixels around the drawing
const trimCanvas = (function () {
  function rowBlank(imageData, width, y) {
    for (let x = 0; x < width; ++x) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) {
        return false;
      }
    }
    return true;
  }

  function columnBlank(imageData, width, x, top, bottom) {
    for (let y = top; y < bottom; ++y) {
      if (imageData.data[y * width * 4 + x * 4 + 3] !== 0) {
        return false;
      }
    }
    return true;
  }

  return function (canvas) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let bottom = imageData.height,
      left = 0,
      right = imageData.width,
      top = 0;

    while (top < bottom && rowBlank(imageData, width, top)) {
      ++top;
    }
    while (bottom - 1 > top && rowBlank(imageData, width, bottom - 1)) {
      --bottom;
    }
    while (left < right && columnBlank(imageData, width, left, top, bottom)) {
      ++left;
    }
    while (
      right - 1 > left &&
      columnBlank(imageData, width, right - 1, top, bottom)
    ) {
      --right;
    }

    const trimmed = ctx.getImageData(left, top, right - left, bottom - top);
    const copy = canvas.ownerDocument.createElement("canvas");
    const copyCtx = copy.getContext("2d");
    copy.width = trimmed.width;
    copy.height = trimmed.height;
    copyCtx.putImageData(trimmed, 0, 0);

    return copy;
  };
})();

const drawText = (
  text: string,
  width: number,
  height: number,
  contextProps: {
    fillStyle?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
  },
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const {
    fillStyle = "black",
    font = "12px Arial",
    textAlign = "left",
    textBaseline = "top",
  } = contextProps;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = fillStyle;
  ctx.font = font;
  ctx.font = decreaseFontSize(ctx, canvas.width, text);
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;

  // We search if the display on 2 line is necessary
  let firstLine = text;
  let firstLineMetrics = ctx.measureText(firstLine);

  // If the text is bigger than the max width we split it into 2 lines
  if (multilineCopyright) {
    const wordNumber = text.split(" ").length;
    for (let i = 0; i < wordNumber; i += 1) {
      // Stop removing word when fits within one line.
      // Wher comes the scale from?
      // if (firstLineMetrics.width * (scale ?? 1) < canvas.width) {
      if (firstLineMetrics.width * 1 < canvas.width) {
        break;
      }
      firstLine = firstLine.substring(0, firstLine.lastIndexOf(" "));
      firstLineMetrics = ctx.measureText(firstLine);
    }
  }

  // Define second line if necessary
  const secondLine = text.replace(firstLine, "").trim();

  // At this point we know the number of lines to display.
  let lines = [firstLine, secondLine].filter((l) => {
    return !!l;
  });

  if (textBaseline === "bottom") {
    lines = lines.reverse();
  }

  // Draw the elements on the canvas
  const lineX = textAlign === "right" ? canvas.width : 0;
  let lineY = textBaseline === "bottom" ? canvas.height : 0;

  lines.forEach((line) => {
    const { fontBoundingBoxAscent, fontBoundingBoxDescent } =
      ctx.measureText(line);
    const heightt = fontBoundingBoxAscent + fontBoundingBoxDescent;
    ctx.fillText(line, lineX, lineY);

    let delta = heightt;
    if (textBaseline === "bottom") {
      delta = -heightt;
    }

    lineY = lineY + delta;
  });

  const canvasTrim = trimCanvas(canvas);
  return canvasTrim;
};

const drawCopyright = (
  text: (() => string) | string,
  destCanvas: HTMLCanvasElement,
  options: DrawCopyrightOptions = {},
) => {
  const { fillStyle, font, margin = 10, placement = "bottom-left" } = options;
  const [placementY, placementX] = placement.split("-");
  const txt = typeof text === "function" ? text() : text;
  const canvas = drawText(txt, destCanvas.width, destCanvas.height, {
    fillStyle,
    font,
    textAlign: placementX as CanvasTextAlign,
    textBaseline: placementY as CanvasTextBaseline,
  });

  let x = margin;
  let y = margin;

  if (placementX === "right") {
    x = destCanvas.width - canvas.width - margin;
  }
  if (placementY === "bottom") {
    y = destCanvas.height - canvas.height - margin;
  }

  destCanvas.getContext("2d").drawImage(canvas, x, y);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const drawElement = (
  data: {
    height?: number;
    rotation?: (() => number) | number;
    src: string;
    width?: number;
  },
  destCanvas: HTMLCanvasElement,
  scale: number,
  margin: number,
  padding: number,
  previousItemSize = [0, 0],
  side = "right",
) => {
  const destContext = destCanvas.getContext("2d");
  const { height, rotation, src, width } = data;

  return new Promise<number[] | undefined>((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      destContext.save();
      const elementWidth = (width || 80) * scale;
      const elementHeight = (height || 80) * scale;
      const left =
        side === "left"
          ? margin + elementWidth / 2
          : destCanvas.width - margin - elementWidth / 2;
      const top =
        (side === "left" && copyrightY
          ? copyrightY - padding
          : destCanvas.height) -
        margin -
        elementHeight / 2 -
        previousItemSize[1];

      destContext.translate(left, top);

      if (rotation) {
        const angle = typeof rotation === "function" ? rotation() : rotation;
        destContext.rotate(angle * (Math.PI / 180));
      }

      destContext.drawImage(
        img,
        -elementWidth / 2,
        -elementHeight / 2,
        elementWidth,
        elementHeight,
      );
      destContext.restore();

      // Return the pixels width of the arrow and the margin right,
      // that must not be occupied by the copyright.
      resolve([elementWidth + 2 * padding, elementHeight + 2 * padding]);
    };

    img.onerror = () => {
      resolve(undefined);
    };
  });
};

const calculatePixelsToExport = (map: Map, extent: Extent, coordinates) => {
  let firstCoordinate;
  let oppositeCoordinate;

  if (extent) {
    firstCoordinate = getTopLeft(extent);
    oppositeCoordinate = getBottomRight(extent);
  } else if (coordinates) {
    // In case of coordinates coming from DragBox interaction:
    //   firstCoordinate is the first coordinate drawn by the user.
    //   oppositeCoordinate is the coordinate of the point dragged by the user.
    [firstCoordinate, , oppositeCoordinate] = coordinates;
  }

  if (firstCoordinate && oppositeCoordinate) {
    const firstPixel = map.getPixelFromCoordinate(firstCoordinate);
    const oppositePixel = map.getPixelFromCoordinate(oppositeCoordinate);
    const pixelTopLeft = [
      firstPixel[0] <= oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
      firstPixel[1] <= oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
    ];
    const pixelBottomRight = [
      firstPixel[0] > oppositePixel[0] ? firstPixel[0] : oppositePixel[0],
      firstPixel[1] > oppositePixel[1] ? firstPixel[1] : oppositePixel[1],
    ];

    return {
      h: pixelBottomRight[1] - pixelTopLeft[1],
      w: pixelBottomRight[0] - pixelTopLeft[0],
      x: pixelTopLeft[0],
      y: pixelTopLeft[1],
    };
  }
  return null;
};

// Create an canvas from a map.
const createCanvasImage = (
  map: Map,
  extent?: Extent,
  coordinates?: Coordinate[],
): Promise<HTMLCanvasElement> => {
  // Find all layer canvases and add it to dest canvas.
  const canvases = map.getTargetElement().getElementsByTagName("canvas");

  // Create the canvas to export with the good size.
  let destCanvas: HTMLCanvasElement;
  let destContext: CanvasRenderingContext2D;

  // canvases is an HTMLCollection, we don't try to transform to array because some compilers like cra doesn't translate it right.
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < canvases.length; i += 1) {
    const canvas = canvases[i];
    if (!canvas.width || !canvas.height) {
      continue;
    }
    const clip = calculatePixelsToExport(map, extent, coordinates) || {
      h: canvas.height,
      w: canvas.width,
      x: 0,
      y: 0,
    };

    if (!destCanvas) {
      destCanvas = document.createElement("canvas");
      destCanvas.width = clip.w;
      destCanvas.height = clip.h;
      destContext = destCanvas.getContext("2d");
    }

    // Draw canvas to the canvas to export.
    destContext.drawImage(
      canvas,
      clip.x,
      clip.y,
      clip.w,
      clip.h,
      0,
      0,
      destCanvas.width,
      destCanvas.height,
    );
  }

  return Promise.resolve(destCanvas);
};

const downloadCanvasImage = (
  canvas: HTMLCanvasElement,
  format = "image/png",
  getDownloadImageName = (formatImage: string) => {
    return formatImage.replace("/", ".");
  },
): Promise<boolean> => {
  try {
    // @ts-expect-error - msToBlob is not standard
    if (window.navigator.msSaveBlob) {
      // ie 11 and higher
      let image;
      try {
        // @ts-expect-error - msToBlob is not standard
        image = canvas.msToBlob();
      } catch (error) {
        console.error(error);
      }
      const blob = new Blob([image], {
        type: format,
      });
      // @ts-expect-error - msSaveBlob is not standard
      window.navigator.msSaveBlob(blob, getDownloadImageName(format));
    } else {
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.download = getDownloadImageName(format);
        link.href = URL.createObjectURL(blob);
        // append child to document for firefox to be able to download.
        document.body.appendChild(link);
        link.click();
      }, format);
    }

    return Promise.resolve(true);
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
};

// Create a map with the good pixel ratio and the good extent
const createMapToExport = async (
  map: Map,
  layers: BaseLayer[],
  extent?: Extent,
  size?: Size,
  mapOptions: MapOptions = {},
  viewOptions: ViewOptions = {},
): Promise<Map> => {
  const mapSize = size || map.getSize();
  const extentToFit = extent;

  // We create a temporary map.
  const div = document.createElement("div");
  div.style.width = `${mapSize[0]}px`;
  div.style.height = `${mapSize[1]}px`;
  div.style.margin = `0 0 0 -50000px`; // we move the map to the left to be ensure it is hidden during export
  document.body.style.overflow = "hidden";
  div.style.position = "absolute";
  div.style.top = "400px";
  div.style.zIndex = "10000";
  document.body.append(div);

  const mapHd = new Map({
    pixelRatio: window.devicePixelRatio,
    target: div,
    view: new View({
      center: map.getView().getCenter(),
      projection: map.getView().getProjection(),
      zoom: map.getView().getZoom(),
      ...viewOptions,
      // extent: extentToFit,
    }),
    ...mapOptions,
  });

  if (extentToFit) {
    mapHd.getView().fit(extentToFit);
  }

  mapHd.setLayers(layers);

  // The following is a bit hackish I think it's because the RealtimeLayer is never considered as readyif there is not trajectories
  const promise = new Promise<Map>((resolve) => {
    // If nothing happens in 10 sec we try to produce a pdf
    const timeout = window.setTimeout(() => {
      resolve(mapHd);
    }, 10000);

    // rendercomplete is triggered when all the layers renderer have the property "ready" to true.
    mapHd.once("rendercomplete", () => {
      clearTimeout(timeout);
      resolve(mapHd);
    });
  });

  return await promise;
};

// Sizes in pixel from a jspdf format
export const sizesByFormat72Dpi: Record<string, number[]> = {
  // https://www.din-formate.de/reihe-a-din-groessen-mm-pixel-dpi.html
  A0: [3370, 2384],
  A1: [2384, 1684],
  A3: [1191, 842],
  A4: [842, 595],
};

export interface CopyrightExportOptions {
  margin?: number;
  padding?: number;
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  text?: string;
}

export interface MapExportOptions {
  copyrightOptions?: CopyrightExportOptions;
  maxExtent?: number[];
  onAfter?: (map: Map, layers: BaseLayer[]) => void;
  onBefore?: (map: Map, layers: BaseLayer[]) => void;
  pixelRatio?: number;
  text?: string;
  useCopyright?: boolean;
  usePlaceholder?: boolean;
}

async function exportPdf(
  map: Map,
  formatOptions: jsPDFOptions = {},
  mapExportOptions: MapExportOptions = {},
): Promise<boolean> {
  const {
    maxExtent,
    onAfter,
    onBefore,
    pixelRatio = 3,
    useCopyright = true,
    usePlaceholder = true,
  } = mapExportOptions;

  const format = formatOptions?.format || "A4";
  const sizePt = sizesByFormat72Dpi[format as string] || (format as number[]);
  const size = sizePt.map((n) => {
    return (n * 96) / 72;
  });
  const extent = maxExtent;

  // Save current pixel ratio
  const actualPixelRatio = window.devicePixelRatio;

  // Set pixel ratio for maplibre
  Object.defineProperty(window, "devicePixelRatio", {
    get() {
      return pixelRatio;
    },
  });

  // Create a shadow map during export process to avoid flickering
  let placeholderCanvas: HTMLCanvasElement | undefined;
  if (usePlaceholder) {
    placeholderCanvas = await createCanvasImage(map);
    placeholderCanvas.style.zIndex = "0";
    placeholderCanvas.style.position = "absolute";
    map
      .getViewport()
      .querySelector(".ol-layers")
      .insertAdjacentElement("afterend", placeholderCanvas);
  }

  // Save current map state
  const layers = [...map.getLayers().getArray()];

  const copyrightText =
    mapExportOptions?.copyrightOptions?.text ||
    map
      .getControls()
      .getArray()
      .find((control) => {
        return control instanceof CopyrightControl;
        // @ts-expect-error - element is private
      })?.element?.textContent;

  map.getLayers().clear();

  // Hide/show some layer before export
  onBefore?.(map, layers);

  // Creates a new map with proper size and extent
  const mapToExport = await createMapToExport(map, layers, extent, size, {
    pixelRatio: pixelRatio,
  });
  Object.defineProperty(window, "devicePixelRatio", {
    get() {
      return actualPixelRatio;
    },
  });

  // Creates map canvas image
  const canvas = await createCanvasImage(mapToExport);

  // Clean up mapHd
  mapToExport.getLayers().clear();
  mapToExport.getTargetElement().remove();
  mapToExport.setTarget(null);
  mapToExport.dispose();

  document.body.style.overflow = "auto";

  // Reset map to previous state
  map.setLayers(layers);

  // Undo what you have done on onBefore
  onAfter?.(map, layers);

  if (placeholderCanvas) {
    map.once("rendercomplete", () => {
      placeholderCanvas.remove();
    });
  }

  // Add custom content
  if (useCopyright) {
    drawCopyright(copyrightText, canvas, {
      ...(mapExportOptions?.copyrightOptions || {}),
      font: `${(pixelRatio * 12).toString()}px Arial`,
    });
  }

  // Transform to PDF
  if (/^A[0-9]{1,2}/.test(format as string) || format?.length === 2) {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        ...formatOptions,
      });

      // Add canvas to PDF
      doc.addImage(canvas, "JPEG", 0, 0, sizePt[0], sizePt[1]);

      // Download the pdf
      doc.save(`${EXPORT_PREFIX}-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  } else {
    // Download the canvas as image
    return await downloadCanvasImage(canvas);
  }
}

export default exportPdf;
