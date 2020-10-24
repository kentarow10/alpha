import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { startFetch, fetchError, getPosts, refetch } from './actions';
import { TimeLimeScreen } from '../screenTypes';

const initialState: TimeLimeScreen = {
  isFetching: false,
  isError: false,
  refetch: false,
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
  }))
  .case(refetch, (state, payload) => ({
    ...state,
    refetch: !state.refetch,
  }));

export default reducer;
