/* eslint-disable import/no-extraneous-dependencies */
import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const ctx = await esbuild.context({
  entryPoints: ["./src/index.js"],
  bundle: true,
  external: ["mapbox-gl"],
  loader: {
    ".png": "dataurl",
  },
  outfile: "index.js",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: true,
});

const { host, port } = await ctx.serve({
  servedir: ".",
});

await ctx.watch();
console.log(
  `watching... and running at ${
    host === "0.0.0.0" ? "http://localhost" : host
  }:${port}`,
);
