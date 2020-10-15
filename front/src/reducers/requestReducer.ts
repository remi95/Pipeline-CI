import { Action } from './index';
import {
  FETCH_REQUESTS, GET_REQUESTS, POST_REQUEST, SET_IS_LOADING,
} from '../actions/request/type';

const initialState = {
  requests: [],
  isLoading: false,
  error: null,
  request: null,
};

const requestReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case FETCH_REQUESTS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        isLoading: false,
      };
    case POST_REQUEST:
      return {
        ...state,
        request: action.payload,
        isLoading: false,
      };
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export default requestReducer;
