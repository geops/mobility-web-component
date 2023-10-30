# mobility-web-component

A web component used to display a map using different [geOps apis](https://developer.geops.io/).

The map displays realtime vehicles, and allow to click on them to display their schedule plan.


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
