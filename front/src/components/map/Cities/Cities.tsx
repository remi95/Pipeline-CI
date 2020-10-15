import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import {
  FeatureGroup, Polygon, Tooltip, useLeaflet,
} from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';
import * as L from 'leaflet';
import { CityGeo } from '../../../models/GeoModel';

const Cities: React.FC = () => {
  const [featureGroup, setFeatureGroup] = useState<FeatureGroup | null>(null);
  const cities: CityGeo[] = useSelector((state: RootStateOrAny) => state.map.geoCities);
  const concertoMap = useLeaflet().map;

  useEffect(() => {
    if (concertoMap && featureGroup && cities.length > 0 && cities[0] !== null) {
      concertoMap.fitBounds(featureGroup.leafletElement.getBounds() as LatLngBoundsExpression);
    }
  }, [featureGroup, cities]);

  return (
    <FeatureGroup ref={(ref): void => setFeatureGroup(ref)}>
      {
        cities.map((city: CityGeo) => {
          if (city === null) return null;
          return (
            <Polygon
              key={`polyline_region_${city.code}`}
              positions={city.contour.coordinates as L.LatLngExpression[][]}
              color="#7c84e4"
            >
              <Tooltip>{`${city.nom}`}</Tooltip>
            </Polygon>
          );
        })
      }
    </FeatureGroup>
  );
};

export default Cities;
