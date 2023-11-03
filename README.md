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

- apikey: string;
- baselayer?: string;
- center: string;
- geolocation?: string;
- maxzoom?: string;
- minzoom?: string;
- mots?: string;
- notification?: string;
- notificationat?: string;
- notificationurl?: string;
- notificationbeforelayerid?: string;
- realtime?: string;
- realtimeurl?: string;
- tenant?: string;
- zoom: string;

Another url parameter is used to get a full screen map instead of the documentation:

- fullscreen=true

## Client specific code

If a client, for example `trenord`, needs a `mobility-web-component` with custom foncionnalities.
Never add custom client specific stuff in this project, instead:

- create a fork from this project, and call it `trenord-mobility-web-component`.
- change the package name in `package.json` to `@geops/trenord-mobility-web-component`.
- change the `README` and `index.html` titles.
- create a new `MobilityMap` component in `src/` called `TrenordMobilityMap`. In this component you can copy the content of `MobilityMap` or just use the `MobilityMap` component with default values. It depends of your use case.
- change the `MobilityMap` import to `TrenordMobilityMap` in `src/index.tsx`.
- create a new npm package on `npmjs.com` from this repository, and call it `@geops/trenord-mobility-web-component`.
- publish a beta version to test the publishing with `ỳarn publish:beta`

At this point you're ready to create custom code, some rules must be followed to facilitate the merge of remote `mobility-web-component` project:

- always create new components using the client name as prefix, like `TrenordRouteSchedule`,  or put them in a client specific folder `src/trenord/RoutSchedule`.
- never modify the original components in the forked project, do it in the remote project then merge it in the forked project.
- never update dependencies in the forked project, do it in the remote project then merge it in the forked project.
- if you have a doubt, ask.
