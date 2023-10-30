import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

await esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  minify: true,
  external: ["mapbox-gl"],
  loader: {
    ".png": "dataurl",
  },
  outfile: "index.js",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: false,
});
