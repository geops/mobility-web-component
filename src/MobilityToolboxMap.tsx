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
  notificationgraphs: string;
  realtimeurl: string;
  maxzoom: string;
  minzoom: string;
};

const params = new URLSearchParams(window.location.search);
const copyrightControl = new CopyrightControl({});
const map = new Map({ controls: [new ScaleLine()] });

export const MapContext = createContext(null);

const useBaseLayer = (
  baselayer: string,
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
        url: `https://maps.style-dev.geops.io/styles/${baselayer}/style.json`,
        name: `mwc.baselayer.${baselayer}`,
      });
      layer.attachToMap(map);
      copyrightControl.attachToMap(map);
      setBaseLayer(layer);
    }
    return () => {
      map.setTarget();
    };
  }, [baselayer, target, apikey]);
  return baseLayer;
};

function MobilityToolboxMap({
  type = 'basic',
  apikey,
  baselayer,
  center,
  mots,
  tenant,
  zoom,
  notificationurl,
  realtimeurl,
  maxzoom,
  minzoom,
}: Props) {
  const [ref, setRef] = useState<HTMLDivElement>();
  const baseLayer = useBaseLayer(baselayer, apikey, map, ref);
  const maximumZoom = (params.get('maxzoom') || maxzoom) && parseFloat(params.get('maxzoom') || maxzoom);
  const minimumZoom = (params.get('minzoom') || minzoom) && parseFloat(params.get('minzoom') || minzoom);

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
          />
        ) : null}
      </div>
    </MapContext.Provider>
  );
}

export default MobilityToolboxMap;
