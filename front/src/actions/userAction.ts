import axios from 'axios';
import { Department } from '../models/GeoModel';
import { fetchData, postData } from '../helpers/ApiHelper';
import { CHECK_USER_URL, LOGIN_URL, REGISTER_URL, API_URL } from '../config/api';
import { setFlashMessage } from './appAction';
import { FlashMessageType } from '../models/FlashMessageModel';
import { LOCAL_STORAGE_API_TOKEN } from '../config/config';
import { User } from '../models/UserModel';

export const SET_DEPARTMENT = 'SET_DEPARTMENT';
export const LOGIN = 'LOGIN';
export const REGISTER = 'REGISTER';
export const SET_LOADING = 'SET_LOADING';
export const CHECK_USER = 'CHECK_USER';
export const FETCH_USER_FAVORS = 'FETCH_USER_FAVORS';
export const GET_USER_FAVORS = 'GET_USER_FAVORS';
export const GET_USER_FAVORS_ERROR = 'GET_USER_FAVORS_ERROR';
export const USER_CHECKED = 'USER_CHECKED';

export const setDepartment = (department: Department) => (dispatch: Function): Function => (
  dispatch({ type: SET_DEPARTMENT, payload: department })
);

export const setUserLoading = (isLoading: boolean) => (dispatch: Function): Function => (
  dispatch({ type: SET_LOADING, payload: isLoading })
);

const storeToken = (user: User | undefined): void => {
  if (user && 'apiToken' in user && user.apiToken) {
    localStorage.setItem(LOCAL_STORAGE_API_TOKEN, user.apiToken);
  }
};

export const login = (data: FormData) => async (dispatch: Function): Promise<Function> => {
  try {
    const response = await postData(LOGIN_URL, data);
    storeToken(response[0]);
    return dispatch({ type: LOGIN, payload: response[0] });
  } catch (e) {
    return dispatch(setFlashMessage('Identifiants invalides.', FlashMessageType.DANGER));
  }
};

export const register = (data: FormData) => async (dispatch: Function): Promise<Function> => {
  try {
    const response = await postData(REGISTER_URL, data);
    storeToken(response[0]);
    return dispatch({ type: REGISTER, payload: response[0] });
  } catch (e) {
    return dispatch(setFlashMessage(`Une erreur est survenue : ${e}`, FlashMessageType.DANGER));
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const checkUser = () => (
  async (dispatch: Function, getState: Function): Promise<void> => {
    try {
      const storedToken = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);

      if (getState().user.user || !storedToken) {
        return;
      }

      const response = await fetchData(CHECK_USER_URL);

      if (response) {
        axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        dispatch({ type: CHECK_USER, payload: response[0] });
      }
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_API_TOKEN);
      console.info('User token cleared');
    } finally {
      dispatch({ type: USER_CHECKED, payload: true });
    }
  }
);

export const getUserFavors = () => {
  return async (dispatch: Function, getState: Function): Promise<void> => {
    try {
      dispatch({ type: FETCH_USER_FAVORS });
      const response = await axios.get(`${CHECK_USER_URL}/favors`);
      dispatch({
        type: GET_USER_FAVORS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: GET_USER_FAVORS_ERROR,
        payload: error,
      });
    }
  };
};

export const acceptUserFromFavor = (favorId: number, userToAcceptId: number, accepted: boolean) => {
  return async (dispatch: Function, getState: Function): Promise<void> => {
    try {
      // dispatch({ type: FETCH_USER_FAVORS });
      const data = new FormData();
      data.append('accepted', accepted.toString());
      const response = await axios.post(`${API_URL}/favor/accept/${favorId}/${userToAcceptId}`, data);
      const userFavors = await axios.get(`${CHECK_USER_URL}/favors`);
      dispatch({
        type: GET_USER_FAVORS,
        payload: userFavors.data,
      });
    } catch (error) {
      dispatch({
        type: GET_USER_FAVORS_ERROR,
        payload: error,
      });
    }
  };
};
