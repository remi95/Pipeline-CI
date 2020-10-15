import axios from 'axios';
import { BASE_URL } from '../../config';
import {
  FETCH_CATEGORIES,
  GET_CATEGORIES,
  GET_CATEGORIES_ERROR,
  FETCH_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORY_ERROR,
  INIT_CATEGORY,
} from './type';

export const getCategories = () => async (dispatch: Function): Promise<void> => {
  try {
    dispatch({ type: FETCH_CATEGORIES });
    const response = await axios.get(`${BASE_URL}/api/v1/category`);
    dispatch({
      type: GET_CATEGORIES,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORIES_ERROR,
      payload: error,
    });
  }
};

export const getCategory = (id: string) => async (dispatch: Function) => {
  try {
    dispatch({ type: FETCH_CATEGORY });
    const response = await axios.get(`${BASE_URL}/api/v1/category/${id}`);
    dispatch({
      type: GET_CATEGORY,
      payload: response.data.results[0],
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_ERROR,
      payload: error,
    });
  }
};

export const initCategory = () => (dispatch: Function): void => {
  dispatch({
    type: INIT_CATEGORY,
    payload: null,
  });
};
