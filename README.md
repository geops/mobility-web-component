# mobility-web-component

This project contains a set of web components allowing to use easily the [geOps APIs](https://developer.geops.io/):

- `<geops-mobility>`: a web component used to display a map using different [geOps APIs](https://developer.geops.io/).
- `<geops-mobility-search>`: a search input to search stops using the  [geOps Stops API](https://developer.geops.io/apis/stops).

## Demo

You can see the web components in action using the [official website](https://mobility-web-component.geops.io/).

The Vite build, used for development, is also deployed on [https://main-mobility-web-component.vercel.app/](https://main-mobility-web-component.vercel.app/).

If supported, you can see the web-component in fullscreen mode using the URL parameter `fullscreen=true`:

## Development

If you want only the basic HTML, faster development process.

```bash
corepack enable
yarn install
yarn start
```

If you want the NextJS documentation website:

```bash
corepack enable
yarn install && cd doc && yarn install
yarn doc
```

## Deployment

The NextJS documentation website is deployed automatically after a merge on master using Vercel, on 
[https://mobility-web-component.geops.io/](https://mobility-web-component.geops.io/).

For forked project, the static index.html file is enough as documentation for the client. No need to provide the NextJS documentation website.
Just set it up properly in vercel. See [RVF configuration](https://vercel.com/geops/rvf-mobility-web-component) for an example.

## Guidelines

- every  new components must have a new folder `MyComponent` with an `index.tsx` that contains only an export and a `MyNewComponent.tsx` file. The reason is too simplify the override in forked project.

## Client specific code

If a client, for example `trenord`, needs a `mobility-web-component` with custom functionnalities.
Never add custom client specific stuff in this repository, instead:

- create a fork from this repository, and call it `trenord-mobility-web-component`.
- change the package name in `package.json` to `@geops/trenord-mobility-web-component`.
- change the `README` and `index.html` titles.
- create a new `MobilityMap` component in `src/` called `TrenordMobilityMap`. In this component you can copy the content of `MobilityMap` or just use the `MobilityMap` component with default values. It depends of your use case.
- change the `MobilityMap` import to `TrenordMobilityMap` in `src/MobilityMap/index.tsx`.
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

yarn upstream
```
