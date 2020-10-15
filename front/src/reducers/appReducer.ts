import { Action } from './index';
import { FlashMessage } from '../models/FlashMessageModel';
import { SET_FLASH_MESSAGE, SET_HAS_CHOOSE_GEOZONE } from '../actions/appAction';

interface StateType {
  flashMessage: FlashMessage|null;
  hasChooseGeoZone: boolean;
}

const initialState: StateType = {
  flashMessage: null,
  hasChooseGeoZone: false,
};

export default (state = initialState, action: Action): StateType => {
  switch (action.type) {
    case SET_FLASH_MESSAGE:
      return { ...state, flashMessage: action.payload };
    case SET_HAS_CHOOSE_GEOZONE:
      return { ...state, hasChooseGeoZone: action.payload };
    default:
      return state;
  }
};
