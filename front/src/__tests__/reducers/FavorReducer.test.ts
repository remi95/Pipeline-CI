import favorReducer, { initialState } from '../../reducers/favorReducer';
import {
  FETCH_FAVORS, GET_FAVORS, GET_FAVORS_ERROR, POST_COMMENT, POST_FAVOR, SET_IS_LOADING,
} from '../../actions/favor/type';
import { getFavorsResponse } from '../../mocks/favorsMock';

describe('Favor reducer', () => {
  it('should return the initial state', () => {
    expect(favorReducer(undefined, { type: '', payload: null })).toEqual(initialState);
  });

  it('should handle FETCH_FAVORS', () => {
    expect(favorReducer(initialState, {
      type: FETCH_FAVORS,
      payload: undefined,
    })).toEqual({
      error: null,
      favors: {},
      isLoading: true,
      favor: null,
      postedComment: null,
    });
  });

  it('should handle GET_FAVORS', () => {
    expect(favorReducer(initialState, {
      type: GET_FAVORS,
      payload: getFavorsResponse,
    })).toEqual({
      error: null,
      favors: getFavorsResponse,
      isLoading: false,
      favor: null,
      postedComment: null,
    });
  });

  it('should handle GET_FAVORS_ERROR', () => {
    expect(favorReducer(initialState, {
      type: GET_FAVORS_ERROR,
      payload: {
        message: 'Erreur',
      },
    })).toEqual({
      error: {
        message: 'Erreur',
      },
      favors: {},
      isLoading: false,
      favor: null,
      postedComment: null,
    });
  });

  it('should handle POST_FAVOR', () => {
    expect(favorReducer(initialState, {
      type: POST_FAVOR,
      payload: getFavorsResponse.results[0],
    })).toEqual({
      error: null,
      favors: {},
      isLoading: false,
      favor: getFavorsResponse.results[0],
      postedComment: null,
    });
  });

  it('should handle SET_IS_LOADING', () => {
    expect(favorReducer(initialState, {
      type: SET_IS_LOADING,
      payload: true,
    })).toEqual({
      error: null,
      favors: {},
      isLoading: true,
      favor: null,
      postedComment: null,
    });
  });

  it('should handle POST_COMMENT', () => {
    expect(favorReducer(initialState, {
      type: POST_COMMENT,
      payload: getFavorsResponse.results[0].comments[0],
    })).toEqual({
      error: null,
      favors: {},
      isLoading: false,
      favor: null,
      postedComment: getFavorsResponse.results[0].comments[0],
    });
  });
});
