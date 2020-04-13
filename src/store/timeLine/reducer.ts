import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { startFetch, fetchError, getPosts } from './actions';
import { TimeLimeScreen } from '../screenTypes';

const initialState: TimeLimeScreen = {
  isFetching: false,
  isError: false,
  posts: [],
};

const reducer: Reducer<TimeLimeScreen> = reducerWithInitialState(initialState)
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
