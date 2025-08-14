import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const ctx = await esbuild.context({
  bundle: true,
  entryPoints: ["./src/index.js"],
  external: ["mapbox-gl"],
  loader: {
    ".png": "dataurl",
    ".svg": "dataurl",
  },
  outfile: "index.js",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: true,
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
