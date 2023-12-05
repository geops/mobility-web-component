# Icons

This folder contains icons used inside the web component.
Icons are preact components that display an SVG. No raster data (PNGs,JPEGs...).
Until we decide otherwise, we don't want to use automatic transformation from SVG to component like using SVGR.
So you must create and clean your component manually.

Icon must have their color defines with currentColor

You can let the original svg file in the corrsponding folder to keep track of them.

## Guidelines

- Structure of folders follows the same rules as in normal components.

```bash
MyIcon/index.tsx   // only export the component
      /MyIcon.tsx  // the component containing the SVG
      /icon.svg    // the original SVG file
```

- Set the width and height attribute to 24 pixels

- Propagate all the component props

- Set the fill attribute to `currentcColor`
  
- Clean all useless properties.

Here an example how it should look like:

```js
function MyIcon({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 14 14"
      {...props}
    >
    </svg>
  );
}

```

## Where to find icons

For now, if you need new icon, use https://www.svgrepo.com/  and select only icons you are allowed to use and modify.
