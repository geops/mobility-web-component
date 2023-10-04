import { CopyrightControl, MaplibreLayer } from 'mobility-toolbox-js/ol';
import { Map } from 'ol';
import ScaleLine from 'ol/control/ScaleLine.js';
import { useEffect, useState } from 'preact/hooks';
import { createContext } from 'preact';
// @ts-ignore
import olStyle from 'ol/ol.css';
// @ts-ignore
import style from './style.css';
import RealtimeLayer from './RealtimeLayer/RealtimeLayer';
import NotificationLayer from './NotificationLayer/NotificationLayer';

type Props = {
  class: string;
  type: 'basic' | 'realtime' | 'notification';
  apikey: string;
  baselayer: string;
  center: string;
  zoom: string;
  mots: string;
  tenant: string;
  notificationurl: string;
  notificationbeforelayerid: string;
  realtimeurl: string;
  maxzoom: string;
  minzoom: string;
};

const params = new URLSearchParams(window.location.search);
const copyrightControl = new CopyrightControl({});
const map = new Map({ controls: [new ScaleLine()] });

export const MapContext = createContext(null);

const useBaseLayer = (
  style: string,
  apikey: string,
  map: Map,
  target: HTMLDivElement,
) => {
  const [baseLayer, setBaseLayer] = useState(null);
  useEffect(() => {
    if (apikey && target) {
      map.setTarget(target);
      map.updateSize();

      const layer = new MaplibreLayer({
        apiKey: apikey,
        url: `${
          params.get('tileurl') || 'https://maps.geops.io'
        }/styles/${style}/style.json`,
        name: `mwc.baselayer.${style}`,
      });
      layer.attachToMap(map);
      copyrightControl.attachToMap(map);
      setBaseLayer(layer);
    }
    return () => {
      map.setTarget();
    };
  }, [style, target, apikey]);
  return baseLayer;
};

function MobilityToolboxMap({
  type = 'basic',
  apikey,
  baselayer,
  center = '831634,5933959',
  mots = 'rail',
  tenant,
  zoom = '10',
  notificationurl,
  notificationbeforelayerid,
  realtimeurl,
  maxzoom,
  minzoom,
}: Props) {
  const [ref, setRef] = useState<HTMLDivElement>();
  const baseLayerStyle = params.get('baselayer') || baselayer;
  const baseLayer = useBaseLayer(baseLayerStyle, apikey, map, ref);
  const maximumZoom =
    (params.get('maxzoom') || maxzoom) &&
    parseFloat(params.get('maxzoom') || maxzoom);
  const minimumZoom =
    (params.get('minzoom') || minzoom) &&
    parseFloat(params.get('minzoom') || minzoom);

  useEffect(() => {
    map.getView().setCenter(center.split(',').map((c) => parseInt(c)));
    map.getView().setZoom(parseInt(zoom));
    map.getView().setMaxZoom(maximumZoom);
    map.getView().setMinZoom(minimumZoom);
  }, [center, zoom, minimumZoom, maximumZoom]);

  return (
    <MapContext.Provider value={{ map, baseLayer }}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div
        ref={(el) => setRef(el as HTMLDivElement)}
        className="w-full h-full relative"
      >
        {false}
        {baseLayer && type === 'realtime' ? (
          <RealtimeLayer
            apikey={apikey}
            mots={mots}
            tenant={tenant}
            realtimeUrl={realtimeurl}
          />
        ) : null}
        {baseLayer && type === 'notification' ? (
          <NotificationLayer
            notificationUrl={notificationurl}
            notificationBeforeLayerId={notificationbeforelayerid}
          />
        ) : null}
      </div>
    </MapContext.Provider>
  );
}

export default MobilityToolboxMap;
