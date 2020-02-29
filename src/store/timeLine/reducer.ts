import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { startFetch, fetchError, getPosts } from './actions';
import { TimeLime } from './timeLine';

const initialState: TimeLime = {
  isFetching: false,
  isError: false,
  posts: [],
};

const reducer: Reducer<TimeLime> = reducerWithInitialState(initialState)
  .case(startFetch, (state, payload) => ({
    ...state,
    isFetching: true,
  }))
  .case(fetchError, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: true,
  }))
  .case(getPosts, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: false,
    posts: payload,
  }));

export default reducer;
