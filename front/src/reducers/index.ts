import { combineReducers } from 'redux';
import mapReducer from './mapReducer';
import categoryReducer from './categoryReducer';
import favorReducer from './favorReducer';
import requestReducer from './requestReducer';
import userReducer from './userReducer';
import appReducer from './appReducer';
import formReducer from './formReducer';

export interface Action {
  type: string;
  payload: any;
}

export interface ApiResponse {
  statusCode: number;
  error: any;
  currentPage: string;
  totalPages: string;
  itemsPerPage: number;
  totalItems: number;
  results: [] | {} | null | undefined;
}

const reducers = combineReducers({
  app: appReducer,
  categoryReducer,
  favorReducer,
  form: formReducer,
  map: mapReducer,
  request: requestReducer,
  user: userReducer,
});

export default reducers;
