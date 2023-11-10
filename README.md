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

## Guidlines

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
