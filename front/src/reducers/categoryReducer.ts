import {
  GET_CATEGORIES, FETCH_CATEGORIES, GET_CATEGORIES_ERROR, GET_TOP_CATEGORIES_ERROR,
  FETCH_CATEGORY, GET_CATEGORY, GET_CATEGORY_ERROR, INIT_CATEGORY,
} from '../actions/category/type';

const initialState = {
  categories: [],
  category: null,
  topCategories: [],
  error: null,
};

const categorieReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
    case FETCH_CATEGORY:
      return {
        ...state,
        categoriesLoading: true,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        categoriesLoading: false,
      };
    case GET_CATEGORIES_ERROR:
    case GET_CATEGORY_ERROR:
      return {
        ...state,
        error: action.payload,
        categoriesLoading: false,
      };

    case GET_CATEGORY:
      return {
        ...state,
        category: action.payload,
        categoriesLoading: false,
      };
    case INIT_CATEGORY:
      return {
        ...state,
        category: null,
        categoriesLoading: false,
      };
    case GET_TOP_CATEGORIES_ERROR:
      return {
        ...state,
        error: action.payload,
        topCategoriesLoading: false,
      };
    default:
      return state;
  }
};

export default categorieReducer;
