import { City, CityGeo } from '../models/GeoModel';

export const cityGeoToCity = (cityGeo: CityGeo): City => ({
  id: parseInt(cityGeo.code, 10),
  name: cityGeo.nom,
  department: 'codeDepartement' in cityGeo && cityGeo.codeDepartement
    ? parseInt(cityGeo.codeDepartement!, 10)
    : 0,
  postalCode: parseInt(cityGeo.codesPostaux[0], 10),
});
