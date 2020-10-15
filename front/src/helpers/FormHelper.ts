import { FORM, FormField } from '../models/FormModel';
import { fetchData } from './ApiHelper';
import { API_URL, AUTH_URL } from '../config/api';

export const getForm = async (formName: FORM, isAuth = false): Promise<FormField[]> => {
  try {
    const fields = await fetchData(`${isAuth ? AUTH_URL : API_URL}/${formName}/form`);
    return fields;
  } catch (e) {
    console.error(`An error occurred while getting form data : ${e}`);
    return [];
  }
};
