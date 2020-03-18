import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Posted, Detail, PostScreen } from './behind';
import {
  startFetch,
  getAnss,
  getParams,
  getNice,
  detailInit,
  add2nd,
  add3rd,
  setImage,
  remove2nd,
  remove3rd,
  getGotit,
  getComments,
} from './actions';

const initialBehind: Behind = {
  screenName: 'POSTED',
  // posted
  ppram: {
    postDoc: '',
    uri: '',
    width: 0,
    height: 0,
    thms: [],
    numNice: 0,
    niceByList: [],
    postBy: '',
    postAt: new Date(),
  },
  anss: [],
  // answer
  body: '',
  // detail
  ansDoc: '',
  ansBy: '',
  ansAt: '',
};

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
  numGotit: 0,
  gotitByList: [],
  comments: [],
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
  }))
  .case(getGotit, (state, payload) => ({
    ...state,
    numGotit: payload.numGotit,
    gotitByList: payload.gotitByList,
  }))
  .case(getComments, (state, payload) => ({
    ...state,
    comments: payload,
  }));

// post screen

const initialPost: PostScreen = {
  addThm2: false,
  addThm3: false,
  thm: [],
  url: '',
  width: 200,
  height: 280,
  imageName: '',
};

export const postReducer: Reducer<PostScreen> = reducerWithInitialState(
  initialPost,
)
  .case(add2nd, (state, payload) => ({
    ...state,
    addThm2: true,
  }))
  .case(add3rd, (state, payload) => ({
    ...state,
    addThm3: true,
  }))
  .case(remove2nd, (state, payload) => ({
    ...state,
    addThm2: false,
  }))
  .case(remove3rd, (state, payload) => ({
    ...state,
    addThm3: false,
  }))
  .case(setImage, (state, payload) => ({
    ...state,
    url: payload.uri,
    imageName: payload.filename,
    width: payload.width,
    height: payload.height,
  }));
