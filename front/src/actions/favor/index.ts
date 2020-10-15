import axios from 'axios';
import { FETCH_FAVORS, GET_FAVORS, GET_FAVORS_ERROR, POST_COMMENT, POST_FAVOR, SET_IS_LOADING, } from './type';
import { setFlashMessage } from '../appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import { postData } from '../../helpers/ApiHelper';
import { FAVOR_URL, POST_FAVOR_COMMENT_URL, POST_FAVOR_URL } from '../../config/api';
import { LOCAL_STORAGE_DEPARTMENT } from '../../config/map';

export interface FavorInterface {
  page?: number;
  category?: string;
  categories?: {}[];
  title?: string;
  cities?: {}[];
  department?: number;
  dateStart?: string;
  dateEnd?: string;
}

export const getFavors = (favor?: FavorInterface): Function => (
  async (dispatch: Function, getState: Function): Promise<Function> => {
    const department = localStorage.getItem(LOCAL_STORAGE_DEPARTMENT);

    if (!department || !('code' in JSON.parse(department))) {
      return dispatch(setFlashMessage('Veuillez choisir votre département dans la section "Changer de zone"', FlashMessageType.WARNING));
    }

    let url = `${FAVOR_URL}?department=${JSON.parse(department).code}`;

    if (favor) {
      if (favor.page) {
        url += `&page=${favor.page}`;
      }
      if (favor.category) {
        url += `&category=${favor.category}`;
      }
      if (favor.title) {
        url += `&title=${favor.title}`;
      }
      if (favor.categories) {
        const categories = favor.categories.map((category: any) => `&categories[]=${category.name.toLowerCase()}`);
        url += categories.toString().replace(/,/g, '');
      }
      if (favor.cities) {
        const cities = favor.cities.map((city: any) => `&cities[]=${city.name.toLowerCase()}`);
        url += cities.toString().replace(/,/g, '');
      }
      if (favor.dateStart) {
        url += `&dateStart=${favor.dateStart}`;
      }
      if (favor.dateEnd) {
        url += `&dateEnd=${favor.dateEnd}`;
      }
    }

    try {
      dispatch({ type: FETCH_FAVORS });
      const response = await axios.get(url);

      if (favor && favor.page && favor.page > 1) {
        const favorsState = getState().favorReducer.favors;
        favorsState.currentPage = favor.page;
        favorsState.results = favorsState.results.concat(response.data.results);
        return dispatch({
          type: GET_FAVORS,
          payload: {
            ...favorsState,
          },
        });
      }

      return dispatch({
        type: GET_FAVORS,
        payload: response.data,
      });
    } catch (error) {
      return dispatch({
        type: GET_FAVORS_ERROR,
        payload: error,
      });
    }
  }
);

export const postFavor = (data: FormData) => async (dispatch: Function): Promise<void> => {
  try {
    dispatch({ type: SET_IS_LOADING, payload: true });

    const response = await postData(POST_FAVOR_URL, data);

    if (Array.isArray(response) && response.length > 0) {
      dispatch({ type: POST_FAVOR, payload: response[0] });
    }
  } catch (e) {
    dispatch(setFlashMessage(`Une erreur est survenue : ${e}`, FlashMessageType.DANGER));
  } finally {
    dispatch({ type: SET_IS_LOADING, payload: false });
  }
};

export const postComment = (data: FormData, favorId: number) => (
  async (dispatch: Function): Promise<void> => {
    try {
      const response = await postData(
        POST_FAVOR_COMMENT_URL.replace(':favorId', favorId.toString()),
        data,
      );

      if (Array.isArray(response) && response.length > 0) {
        dispatch({ type: POST_COMMENT, payload: response[0] });
      }
    } catch (e) {
      return dispatch(
        setFlashMessage(
          'Une erreur est survenue lors de l\'envoi de votre commentaire, veuillez réessayer plus tard.',
          FlashMessageType.DANGER,
        ),
      );
    }
  }
);
