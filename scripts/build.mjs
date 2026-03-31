import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

await esbuild.build({
  bundle: true,
  entryPoints: ["./src/index.js", "./src/indexDoc.js"],
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  minify: true,
  splitting: true,
  format: "esm",
  outdir: "dist",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: false,
});
