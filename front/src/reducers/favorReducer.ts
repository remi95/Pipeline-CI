import {
  GET_FAVORS, FETCH_FAVORS, GET_FAVORS_ERROR, POST_FAVOR, SET_IS_LOADING, POST_COMMENT,
} from '../actions/favor/type';
import { Action } from './index';

export const initialState = {
  favors: {},
  isLoading: false,
  error: null,
  favor: null,
  postedComment: null,
};

const favorReducer = (state = initialState, action: Action): {} => {
  switch (action.type) {
    case FETCH_FAVORS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_FAVORS:
      return {
        ...state,
        favors: action.payload,
        isLoading: false,
      };
    case GET_FAVORS_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case POST_FAVOR:
      return {
        ...state,
        favor: action.payload,
        isLoading: false,
      };
    case SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case POST_COMMENT:
      return { ...state, postedComment: action.payload };
    default:
      return state;
  }
};

export default favorReducer;
