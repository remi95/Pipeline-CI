import axios from 'axios';
import {
  FETCH_REQUESTS, GET_REQUESTS, GET_REQUESTS_ERROR, POST_REQUEST, SET_IS_LOADING,
} from './type';
import { postData } from '../../helpers/ApiHelper';
import { POST_REQUEST_URL, REQUEST_URL } from '../../config/api';
import { setFlashMessage } from '../appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import { LOCAL_STORAGE_DEPARTMENT } from '../../config/map';

export const getRequests = () => async (dispatch: Function): Promise<void> => {
  try {
    const department = localStorage.getItem(LOCAL_STORAGE_DEPARTMENT);

    if (!department || !('code' in JSON.parse(department))) {
      return dispatch(setFlashMessage('Veuillez choisir votre département dans la section "Changer de zone"', FlashMessageType.WARNING));
    }

    dispatch({ type: FETCH_REQUESTS });
    const response = await axios.get(`${REQUEST_URL}?department=${JSON.parse(department).code}`);
    dispatch({
      type: GET_REQUESTS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_REQUESTS_ERROR,
      payload: error,
    });
  }
};

export const postRequest = (data: FormData) => async (dispatch: Function): Promise<void> => {
  try {
    dispatch({ type: SET_IS_LOADING, payload: true });

    const response = await postData(POST_REQUEST_URL, data);

    if (Array.isArray(response) && response.length > 0) {
      dispatch({ type: POST_REQUEST, payload: response[0] });
    }
  } catch (e) {
    dispatch(setFlashMessage(`Une erreur est survenue : ${e}`, FlashMessageType.DANGER));
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
};
