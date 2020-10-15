import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { GET_FAVORS } from '../../actions/favor/type';
import { BASE_URL } from '../../config';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const fetchFavors = () => async (dispatch: Function): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/favor`);
  const json = await response.json();
  dispatch({
    type: GET_FAVORS,
    payload: json,
  });
};

describe('Async get favors', () => {
  it('should GET_FAVORS when fetching favors has been done', () => {
    const store = mockStore({});
    return store.dispatch(fetchFavors() as any)
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toMatchSnapshot();
      });
  });
});
