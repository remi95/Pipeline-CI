import { Action } from './index';
import {
  FETCH_DEPARTMENTS, SET_CITIES_GEO, SET_DEPARTMENTS_GEO, SET_REGIONS_GEO,
} from '../actions/mapAction';

const initialState = {
  geoRegions: [],
  geoDepartments: [],
  geoCities: [],
  departments: [],
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_REGIONS_GEO:
      return { ...state, geoRegions: action.payload };
    case FETCH_DEPARTMENTS:
      return { ...state, departments: action.payload };
    case SET_DEPARTMENTS_GEO:
      return { ...state, geoDepartments: action.payload };
    case SET_CITIES_GEO:
      return { ...state, geoCities: action.payload };
    default:
      return state;
  }
};
