import { Coordinates } from '../helpers/MapHelper';

export enum PolygonType {
  POLYGON = 'Polygon',
  MULTIPOLYGON = 'MultiPolygon',
}

export interface ZoneGeoJson {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    code: string;
    nom: string;
  };
}

export interface Department {
  nom: string;
  code: string;
  codeRegion?: string;
}

export interface City {
  id: number;
  name: string;
  postalCode: number;
  department: number;
}

export interface CityGeo {
  contour: {
    type: string;
    coordinates: Coordinates;
  };
  nom: string;
  code: string;
  codeDepartement?: string;
  codesPostaux: string[];
}
