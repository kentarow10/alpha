import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Posted, Detail } from './behind';
import { startFetch, getAnss, getParams, getNice, detailInit } from './actions';

// posted screen

const initialState: Posted = {
  isFetching: false,
  isError: false,
  ppram: {
    postDoc: '',
    uri: '',
    width: 0,
    height: 0,
    owner: '',
    numNice: 0,
    niceByList: [],
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
      width: payload.width,
      height: payload.height,
      owner: payload.owner,
      numNice: state.ppram.numNice,
      niceByList: state.ppram.niceByList,
      thms: payload.thms,
      createdAt: payload.createdAt,
    },
  }))
  .case(getNice, (state, payload) => ({
    ...state,
    ppram: {
      ...state.ppram,
      numNice: payload.numNice,
      niceByList: payload.niceByList,
    },
  }));

// detail screen

const initialDetail: Detail = {
  isFetching: false,
  isError: false,
  dpram: {
    postDoc: '',
    ansDoc: '',
    uri: '',
    width: 0,
    height: 0,
    thm: '',
    body: '',
    numNice: 0,
    postedBy: '',
    ansBy: '',
    postedAt: new Date(),
    ansAt: new Date(),
  },
};

export const detailReducer: Reducer<Detail> = reducerWithInitialState(
  initialDetail,
)
  .case(startFetch, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
  }))
  .case(detailInit, (state, payload) => ({
    ...state,
    dpram: payload,
  }));
