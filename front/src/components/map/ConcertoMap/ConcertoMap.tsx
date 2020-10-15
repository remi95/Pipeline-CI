import React from 'react';
import {
  ContextProps, Map as LeafletMap, TileLayer, withLeaflet,
} from 'react-leaflet';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, MAP_LAYER } from '../../../config/map';
import Regions from '../Regions/Regions';
import Departments from '../Departments/Departments';
import Cities from '../Cities/Cities';

interface Props extends ContextProps {
  displayRegions?: boolean;
  displayDepartments?: boolean;
  displayCities?: boolean;
  height?: number;
}

const ConcertoMap: React.FunctionComponent<Props> = (props: Props) => {
  const {
    displayRegions, displayDepartments, displayCities, height,
  } = props;

  return (
    <LeafletMap
      center={MAP_DEFAULT_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      attributionControl
      zoomControl
      doubleClickZoom
      scrollWheelZoom
      dragging
      animate
      easeLinearity={0.35}
      style={{ height }}
    >
      <TileLayer
        attribution="&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        url={MAP_LAYER}
      />
      { displayRegions ? <Regions /> : null }
      { displayDepartments ? <Departments /> : null }
      { displayCities ? <Cities /> : null }
    </LeafletMap>
  );
};

ConcertoMap.defaultProps = {
  displayRegions: false,
  displayDepartments: false,
  displayCities: false,
  height: 650,
};

export default withLeaflet(ConcertoMap);
