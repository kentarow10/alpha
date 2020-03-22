import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Posted, Detail, PostScreen, AnsScreen } from './behind';
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
  error,
  done,
  fetching,
  ansInit,
  postInit,
} from './actions';

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
  isFetching: false,
  isError: false,
  isDone: false,
  thm: [],
  url: '',
  width: 200,
  height: 280,
  imageName: '',
};

export const postReducer: Reducer<PostScreen> = reducerWithInitialState(
  initialPost,
)
  .case(postInit, (state, payload) => ({
    isFetching: false,
    isError: false,
    isDone: false,
    thm: [],
    url: '',
    width: 200,
    height: 280,
    imageName: '',
  }))
  .case(fetching, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
  }))
  .case(error, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: true,
  }))
  .case(done, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: false,
    isDone: true,
  }))
  .case(setImage, (state, payload) => ({
    ...state,
    url: payload.uri,
    imageName: payload.filename,
    width: payload.width,
    height: payload.height,
  }));

// answer screen

const initialAnswer: AnsScreen = {
  isFetching: false,
  isError: false,
  isDone: false,
};

export const ansReducer: Reducer<AnsScreen> = reducerWithInitialState(
  initialAnswer,
)
  .case(ansInit, (state, payload) => ({
    isFetching: false,
    isError: false,
    isDone: false,
  }))
  .case(fetching, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
  }))
  .case(error, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: true,
  }))
  .case(done, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: false,
    isDone: true,
  }));
