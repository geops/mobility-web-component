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

