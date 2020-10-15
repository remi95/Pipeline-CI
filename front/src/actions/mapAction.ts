import { fetchExternalData } from '../helpers/ApiHelper';
import { CITIES_URL, DEPARTMENTS_URL } from '../config/api';
import GEOJSON_DEPARTMENTS from '../mocks/departements.json';
import {
  City, CityGeo, Department, ZoneGeoJson,
} from '../models/GeoModel';
import GEOJSON_REGION from '../mocks/regions.json';
import { formatGeoJson } from '../helpers/MapHelper';

export const SET_REGIONS_GEO = 'SET_REGIONS_GEO';
export const SET_DEPARTMENTS_GEO = 'SET_DEPARTMENTS_GEO';
export const SET_CITIES_GEO = 'SET_CITIES_GEO';
export const FETCH_DEPARTMENTS = 'FETCH_DEPARTMENTS';

/**
 * Store all regions with geoJson.
 */
export const getGeoRegions = () => (dispatch: Function, getState: Function): Function | boolean => {
  if (getState().map.geoRegions.length > 0) {
    return false;
  }

  const regions: ZoneGeoJson[] = GEOJSON_REGION.features;
  const formattedGeoJson = regions.map((r) => {
    const region = r;
    region.geometry.coordinates = formatGeoJson(region.geometry.coordinates, region.geometry.type);
    return region;
  });

  return dispatch({ type: SET_REGIONS_GEO, payload: formattedGeoJson });
};

/**
 * Get a departments list from API.
 */
export const fetchAllDepartments = () => (
  async (dispatch: Function, getState: Function): Promise<Function | boolean> => {
    if (getState().map.departments.length > 0) {
      return false;
    }

    const departments = await fetchExternalData(DEPARTMENTS_URL);
    return dispatch({ type: FETCH_DEPARTMENTS, payload: departments });
  }
);


/**
 * Get all departments geoJSON on a given region.
 * @param regionCode
 */
export const setRegionDepartments = (regionCode: string) => (
  (dispatch: Function, getState: Function): Function => {
    const allDepartments = getState().map.departments;
    const geoDepartments: ZoneGeoJson[] = GEOJSON_DEPARTMENTS.features;

    const regionDepartments = allDepartments.filter((department: Department) => (
      department.codeRegion === regionCode
    ));
    const departmentsCodes = regionDepartments.map((department: Department) => department.code);

    const geoRegionDepartments = geoDepartments.filter((geoDepartment: ZoneGeoJson) => (
      departmentsCodes.includes(geoDepartment.properties.code)
    ));

    const formattedGeoJson = geoRegionDepartments.map(
      (d) => {
        const department = d;
        department.geometry.coordinates = formatGeoJson(
          department.geometry.coordinates,
          department.geometry.type,
        );
        return department;
      },
    );

    return dispatch({
      type: SET_DEPARTMENTS_GEO,
      payload: formattedGeoJson,
    });
  }
);

export const fetchCities = (cities: City[]) => async (dispatch: Function): Promise<Function> => {
  const results = await Promise.all(
    cities.map((city) => fetchExternalData(`${CITIES_URL}?codePostal=${city.postalCode}&nom=${city.name}&fields=contour`)),
  );

  const geoCoordinates: (CityGeo | null)[] = results.map((r: CityGeo[]) => {
    const result = r[0];
    if (result === undefined) return null;
    result.contour.coordinates = formatGeoJson(result.contour.coordinates, result.contour.type);
    return result;
  });

  return dispatch({ type: SET_CITIES_GEO, payload: geoCoordinates });
};
