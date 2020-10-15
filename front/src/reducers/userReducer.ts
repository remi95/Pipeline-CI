import { Action } from './index';
import {
  CHECK_USER,
  LOGIN, REGISTER, SET_DEPARTMENT, SET_LOADING, GET_USER_FAVORS, FETCH_USER_FAVORS, USER_CHECKED,
} from '../actions/userAction';

const initialState = {
  department: null,
  user: null,
  userChecked: false,
  isLoading: false,
  favorsLoading: false,
  favors: [],
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case SET_DEPARTMENT:
      return { ...state, department: action.payload };
    case LOGIN:
    case REGISTER:
    case CHECK_USER:
      return { ...state, user: action.payload };
    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case FETCH_USER_FAVORS:
      return { ...state, favorsLoading: true };
    case GET_USER_FAVORS:
      return { ...state, favors: action.payload, favorsLoading: false };
    case USER_CHECKED:
      return { ...state, userChecked: action.payload };
    default:
      return state;
  }
};
