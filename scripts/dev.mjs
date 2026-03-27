import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: ["./src/index.js", "./src/indexDoc.js"],
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  outdir: "dist",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: true,
  splitting: true,
  format: "esm",
  minify: true,
});

const { host, port } = await ctx.serve({
  servedir: ".",
});

await ctx.watch();

// eslint-disable-next-line no-undef
console.log(
  `watching... and running at ${
    !host || host === "0.0.0.0" ? "http://localhost" : host
  }:${port}`,
);
