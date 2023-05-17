import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

let ctx = await esbuild.context({
  entryPoints: ["./src/index.js"],
  bundle: true,
  external: ["mapbox-gl"],
  loader: {
    ".png": "dataurl",
  },
  outfile: "bundle.js",
  plugins: [sassPlugin({ type: "css-text" })],
  sourcemap: true,
});

let { host, port } = await ctx.serve({
  servedir: ".",
});

await ctx.watch();
console.log(`watching... and running at ${host}:${port}`);
