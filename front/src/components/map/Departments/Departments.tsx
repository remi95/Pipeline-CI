import React from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Polygon, Tooltip } from 'react-leaflet';
import { useHistory } from 'react-router-dom';
import { LatLngExpression } from 'leaflet';
import { ZoneGeoJson } from '../../../models/GeoModel';
import { setDepartment } from '../../../actions/userAction';
import ROUTES from '../../../config/routes';
import { LOCAL_STORAGE_DEPARTMENT } from '../../../config/map';
import { setHasGeoZone } from '../../../actions/appAction';

const Departments: React.FC = () => {
  const history = useHistory();
  const departments: ZoneGeoJson[] = useSelector(
    (state: RootStateOrAny) => state.map.geoDepartments,
  );
  const dispatch = useDispatch();

  const handleClick = (department: ZoneGeoJson): void => {
    localStorage.setItem(LOCAL_STORAGE_DEPARTMENT, JSON.stringify(department.properties));
    dispatch(setDepartment(department.properties));
    dispatch(setHasGeoZone(true));
    history.push(ROUTES.HOME);
  };

  return (
    <>
      {
        departments.map((department) => (
          <Polygon
            key={`polyline_region_${department.properties.code}`}
            positions={department.geometry.coordinates as LatLngExpression[][][]}
            color="#ff6633"
            onClick={(): void => handleClick(department)}
          >
            <Tooltip>{`${department.properties.nom} (${department.properties.code})`}</Tooltip>
          </Polygon>
        ))
      }
    </>
  );
};

export default Departments;
