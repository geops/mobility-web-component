# mobility-web-component

A web component used to display a map using different [geOps apis](https://developer.geops.io/).

The map displays realtime vehicles, and allow to click on them to display their schedule plan.
You can also display MOCO notifications.

## Usage Example

```html
<html>
  <body>
    <script type="module" src="https://www.unpkg.com/@geops/mobility-web-component)"></script>
    <geops-mobility apikey="YOUR_GEOPS_API_KEY" style="display: block;width: 400px;height: 800px;"></geops-mobility>
  </body>
</html>
```

## Development

```bash
yarn install
yarn start
```

## URL parameters

You can specify all the web component attributes as url parameters to customize easily the map.

- [`/?apikey=YOUR_API_KEY`](https://mobility-web-component.geops.io/?apikey=YOUR_API_KEY): your [geOps API key](https://developer.geops.io/).
- [`/?baselayer=travic_v2`](https://mobility-web-component.geops.io/?baselayer=travic_v2): the style's name from the [geOps Maps API](https://developer.geops.io/apis/maps) (base_dark_v2, base_bright_v2, ...). Default to `travic_v2`.
- [`/?center=831634,5933959`](https://mobility-web-component.geops.io/?center=831634,5933959): the center of the map in EPSG:3857 coordinates. Default to `831634,5933959` (Bern).
- [`/?geolocation=false`](https://mobility-web-component.geops.io/?geolocation=false): display the geolocation button or not (true or false). Default to true.
- [`/?mapsurl=https://maps.geops.io`](https://mobility-web-component.geops.io/?mapsurl=https://maps.geops.io): the [geOps Maps API](https://developer.geops.io/apis/maps) url to use. Default to `https://maps.geops.io`.
- [`/?maxzoom=14`](https://mobility-web-component.geops.io/?maxzoom=14): define the max zoom level of the map.
- [`/?minzoom=2`](https://mobility-web-component.geops.io/?minzoom=2): define the min zoom level of the map.
- [`/?mots=rail,bus`](https://mobility-web-component.geops.io/?mots=rail,bus): list of commas separated mots to display on the Realtime layer ( rail, bus, coach, foot, tram, subway, gondola, funicular, ferry, car).
- [`/?notification=false`](https://mobility-web-component.geops.io/?notification=true): display the notification layer or not (true or false). Default to true.
- [`/?notificationat=2025-01-01T12:00:00Z`](https://mobility-web-component.geops.io/?notificationat=2025-01-01T12:00:00Z): a ISO date string used to display active notification at this date in the notification layer.
- [`/?notificationbeforelayerid=`](https://mobility-web-component.geops.io/?notificationbeforelayerid=): the style layer's id before which the notification layer will be added. By default the layer will be added on top.
- [`/?notificationurl=`](https://mobility-web-component.geops.io/?notificationurl=): the MOCO notification url to get the notifications from.
- [`/?permalink=true`](https://mobility-web-component.geops.io/?permalink=true): add automatically an `x`,`y` an `z` URL parameters to the URL to allow to share the current map view. Default to false.
- [`/?realtime=false`](https://mobility-web-component.geops.io/?realtime=false): display the realtime layer or not (true or false). Default to true.
- [`/?realtimeurl=wss://api.geops.io/tracker-ws/v1/ws`](https://mobility-web-component.geops.io/?realtimeurl=wss://api.geops.io/tracker-ws/v1/ws): the [geOps Realtime API](https://developer.geops.io/apis/realtime) url to use. Default to `wss://api.geops.io/tracker-ws/v1/ws`.
- [`/?search=false`](https://mobility-web-component.geops.io/?search=false): display the search stops input or not (true or false). Default to true.
- [`/?stopsurl=https://api.geops.io/stops/v1/`](https://mobility-web-component.geops.io/?stopsurl=https://api.geops.io/stops/v1/): the [geOps Stops API](https://developer.geops.io/apis/stops) url to use. Default to `https://api.geops.io/stops/v1/`.
- [`/?tenant=sbb`](https://mobility-web-component.geops.io/?tenant=sbb): the tenant name to use to filter the stations available to select by click.
- [`/?zoom=13`](https://mobility-web-component.geops.io/?zoom=13): the zoom level of the map. Default to 13.

Another url parameter is used to get a full screen map instead of the documentation:

- [`/?fullscreen=true`](https://mobility-web-component.geops.io/?fullscreen=true): display the map in full screen mode.

## Guidelines

- every  new components must have a new folder `MyComponent` with an `index.tsx` that contains only an export and a `MyNewComponent.tsx` file. The reason is too simplifx the override in forked project.


## Client specific code

If a client, for example `trenord`, needs a `mobility-web-component` with custom functionnalities.
Never add custom client specific stuff in this repository, instead:

- create a fork from this repository, and call it `trenord-mobility-web-component`.
- change the package name in `package.json` to `@geops/trenord-mobility-web-component`.
- change the `README` and `index.html` titles.
- create a new `MobilityMap` component in `src/` called `TrenordMobilityMap`. In this component you can copy the content of `MobilityMap` or just use the `MobilityMap` component with default values. It depends of your use case.
- change the `MobilityMap` import to `TrenordMobilityMap` in `src/index.tsx`.
- create a new npm package on `npmjs.com` from this repository, and call it `@geops/trenord-mobility-web-component`.
- publish a beta version to test the publishing with `ỳarn publish:beta`

At this point you're ready to create custom code, some rules must be followed to facilitate the merge of upstream `mobility-web-component` repository:

- always create new components using the client name as prefix, like `TrenordRouteSchedule`,  or put them in a client specific folder `src/trenord/RoutSchedule`.
- to use the overrided components just change the export in the `index.tsx` of the component to overrided.
- never modify the original components in the forked repository, do it in the upstream repository then merge it in the forked repository.
- never update dependencies in the forked repository, do it in the upstream repository then merge it in the forked repository.
- if you have a doubt, ask.

## Merge upstream repository

When you use a fork you can merge the upstream repository using:

```bash
// Set up the upstream remote, to do only once
git remote add upstream git@github.com:geops/mobility-web-component.git

git fetch upstream && git merge upstream/main
```
