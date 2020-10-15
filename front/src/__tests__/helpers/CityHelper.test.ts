import { City, CityGeo } from '../../models/GeoModel';
import { cityGeoToCity } from '../../helpers/CityHelper';

describe('City helper tests', () => {
  it('Should transform CityGeo object to City object.', () => {
    const cityGeoMock: CityGeo = {
      contour: {
        type: 'whatever',
        coordinates: [[[]]],
      },
      nom: 'Bordeaux',
      code: '33000',
      codeDepartement: '33',
      codesPostaux: ['33000', '33300', '33800'],
    };

    const cityExpected: City = {
      id: 33000,
      name: 'Bordeaux',
      department: 33,
      postalCode: 33000,
    };

    expect(cityGeoToCity(cityGeoMock)).toStrictEqual(cityExpected);
  });
});
