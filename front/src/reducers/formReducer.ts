import { Action } from './index';
import { ADD_IMAGE_PREVIEW, CLEAR_IMAGE_PREVIEW, SET_CUSTOM_FIELD_DATA } from '../actions/formAction';

const initialState = {
  imagesPreview: [],
  customFieldsData: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ADD_IMAGE_PREVIEW:
    case CLEAR_IMAGE_PREVIEW:
      return { ...state, imagesPreview: action.payload };
    case SET_CUSTOM_FIELD_DATA:
      return { ...state, customFieldsData: action.payload };
    default:
      return state;
  }
};
