import React from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Polygon, Tooltip, useLeaflet } from 'react-leaflet';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { ZoneGeoJson } from '../../../models/GeoModel';
import { setRegionDepartments } from '../../../actions/mapAction';

const Regions: React.FC = () => {
  const regions: ZoneGeoJson[] = useSelector((state: RootStateOrAny) => state.map.geoRegions);
  const dispatch = useDispatch();
  const concertoMap = useLeaflet().map;

  const handleClick = (e: LeafletMouseEvent, region: ZoneGeoJson): void => {
    const bounds = e.target.getBounds();
    if (concertoMap) concertoMap.fitBounds(bounds);

    dispatch(setRegionDepartments(region.properties.code));
  };

  return (
    <>
      {
        regions.map((region) => (
          <Polygon
            key={`polyline_region_${region.properties.code}`}
            positions={region.geometry.coordinates as LatLngExpression[][][]}
            color="#7c84e4"
            onClick={(e: LeafletMouseEvent): void => handleClick(e, region)}
          >
            <Tooltip>{`${region.properties.nom}`}</Tooltip>
          </Polygon>
        ))
      }
    </>
  );
};

export default Regions;
