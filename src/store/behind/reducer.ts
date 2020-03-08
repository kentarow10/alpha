import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Posted } from './behind';
import { startFetch, getAnss, getParams } from './actions';

// posted screen

const initialState: Posted = {
  isFetching: true,
  isError: false,
  ppram: {
    postDoc: '',
    uri: '',
    owner: '',
    thms: [],
    createdAt: new Date(),
  },
  anss: [],
};

export const postedReducer: Reducer<Posted> = reducerWithInitialState(
  initialState,
)
  .case(startFetch, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
  }))
  .case(getAnss, (state, payload) => ({
    ...state,
    anss: payload,
  }))
  .case(getParams, (state, payload) => ({
    ...state,
    ppram: {
      postDoc: payload.postDoc,
      uri: payload.uri,
      owner: payload.owner,
      thms: payload.thms,
      createdAt: payload.createdAt,
    },
  }));
