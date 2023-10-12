import { CopyrightControl, MaplibreLayer } from 'mobility-toolbox-js/ol';
import { Map } from 'ol';
import ScaleLine from 'ol/control/ScaleLine.js';
import { useEffect, useState } from 'preact/hooks';
// @ts-ignore
import olStyle from 'ol/ol.css';
// @ts-ignore
import style from './style.css';
import RealtimeLayer from './RealtimeLayer/RealtimeLayer';
import NotificationLayer from './NotificationLayer/NotificationLayer';
import { MapContext } from './lib/hooks/useMapContext';
import useParams from './lib/hooks/useParams';

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
const copyrightControl = new CopyrightControl({});
const map = new Map({ controls: [new ScaleLine()] });

const useBaseLayer = (
  style: string,
  apikey: string,
  map: Map,
  target: HTMLDivElement,
) => {
  const { tilesurl } = useParams();
  const [baseLayer, setBaseLayer] = useState(null);
  useEffect(() => {
    if (apikey && target) {
      map.setTarget(target);
      map.updateSize();

      const layer = new MaplibreLayer({
        apiKey: apikey,
        url: `${
          tilesurl || 'https://maps.geops.io'
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
  baselayer = 'travic_v2',
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
  const {
    type: paramsType,
    center: paramsCenter,
    baselayer: paramsBaseLayer,
    zoom: paramsZoom,
    maxzoom: paramsMaxZoom,
    minzoom: paramsMinZoom,
  } = useParams();
  const [ref, setRef] = useState<HTMLDivElement>();
  const mapType = paramsType || type;
  const mapCenter = paramsCenter || center;
  const baseLayerStyle = paramsBaseLayer || baselayer;
  const baseLayer = useBaseLayer(baseLayerStyle, apikey, map, ref);
  const maximumZoom =
    (paramsMaxZoom || maxzoom) && parseFloat(paramsMaxZoom || maxzoom);
  const minimumZoom =
    (paramsMinZoom || minzoom) && parseFloat(paramsMinZoom || minzoom);

  useEffect(() => {
    map.getView().setCenter(mapCenter.split(',').map((c) => parseInt(c)));
    map.getView().setZoom(parseFloat(paramsZoom || zoom));
    map.getView().setMaxZoom(maximumZoom);
    map.getView().setMinZoom(minimumZoom);
  }, []);

  return (
    <MapContext.Provider value={{ map, baseLayer }}>
      <style>{olStyle}</style>
      <style>{style}</style>
      <div
        ref={(el) => setRef(el as HTMLDivElement)}
        className="w-full h-full relative"
      >
        {baseLayer && mapType === 'realtime' ? (
          <RealtimeLayer
            apikey={apikey}
            mots={mots}
            tenant={tenant}
            realtimeUrl={realtimeurl}
          />
        ) : null}
        {baseLayer && mapType === 'notification' ? (
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
