import { PolygonType } from '../models/GeoModel';

export type Coordinates = number[][][]|number[][][][];

/**
 * Format GeoJson to pass Longitude,Latitude coords to Latitude,Longitude coords.
 */
export const formatGeoJson = (coordinates: Coordinates, type: string): Coordinates => {
  if (type === PolygonType.POLYGON) {
    const coords = (coordinates as (number[][][]));

    return coords.map((subCoords: number[][]) => (
      subCoords.map((data) => {
        const longitude = data[0];
        const latitude = data[1];
        return [latitude, longitude];
      })
    ));
  }

  if (type === PolygonType.MULTIPOLYGON) {
    const coords = (coordinates as (number[][][][]));

    return coords.map((geoZone: number[][][]) => (
      geoZone.map((subCoords) => (
        subCoords.map((data) => {
          const longitude = data[0];
          const latitude = data[1];
          return [latitude, longitude];
        })
      ))
    ));
  }

  return coordinates;
};
