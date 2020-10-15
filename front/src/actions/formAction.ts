export const ADD_IMAGE_PREVIEW = 'ADD_IMAGE_PREVIEW';
export const CLEAR_IMAGE_PREVIEW = 'CLEAR_IMAGE_PREVIEW';
export const SET_CUSTOM_FIELD_DATA = 'SET_CUSTOM_FIELD_DATA';

export const setImagesPreview = (images: string[]) => (
  (dispatch: Function): Function => dispatch({ type: ADD_IMAGE_PREVIEW, payload: images })
);

export const clearImagesPreview = () => (dispatch: Function): Function => (
  dispatch({ type: CLEAR_IMAGE_PREVIEW, payload: [] })
);

export const setCustomFieldData = (key: string, data: string|number|[]|object) => (
  (dispatch: Function, getState: Function): Function => {
    const { customFieldsData } = getState().form;
    customFieldsData[key] = data;

    return dispatch({ type: SET_CUSTOM_FIELD_DATA, payload: { ...customFieldsData } });
  }
);
