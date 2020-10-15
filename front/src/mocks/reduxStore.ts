export const mockReduxStore = {
  app: {
    flashMessage: null,
  },
  categoryReducer: {
    categories: [],
    category: null,
    topCategories: [],
    categoriesLoading: false,
    topCategoriesLoading: false,
    error: null,
  },
  favorReducer: {
    favors: [],
    isLoading: false,
  },
  map: {
    geoRegions: [],
    geoDepartments: [],
    geoCities: [],
    departments: [],
  },
  user: {
    department: null,
    user: null,
    isLoading: false,
  },
};
