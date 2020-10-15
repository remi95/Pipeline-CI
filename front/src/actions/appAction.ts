import { FlashMessageType } from '../models/FlashMessageModel';

export const SET_FLASH_MESSAGE = 'SET_FLASH_MESSAGE';
export const SET_HAS_CHOOSE_GEOZONE = 'SET_HAS_CHOOSE_GEOZONE';

export const setFlashMessage = (message: string, type: FlashMessageType, time = 5000) => (dispatch: Function): void => {
  dispatch({
    type: SET_FLASH_MESSAGE,
    payload: { message, type },
  });

  setTimeout(() => {
    dispatch({ type: SET_FLASH_MESSAGE, payload: null });
  }, time);
};

export const setHasGeoZone = (value: boolean) => (dispatch: Function): Function => (
  dispatch({ type: SET_HAS_CHOOSE_GEOZONE, payload: value })
);
