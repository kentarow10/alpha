import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import firebase from '../../../firebase/firebase';

import {
  PostedScreen,
  DetailScreen,
  PostScreen,
  AnsScreen,
} from '../screenTypes';
import {
  startFetch,
  getAnss,
  getParams,
  getNice,
  detailInit,
  setImage,
  getGotit,
  getComments,
  error,
  done,
  fetching,
  ansInit,
  postInit,
  getLinks,
  getMoreAnss1,
  postExist,
  ansExist,
} from './actions';

// posted screen

const initialState: PostedScreen = {
  isFetching: false,
  isError: false,
  postExist: true,
  doneNice: false,
  ppram: {
    postDoc: '',
    uri: '',
    width: 0,
    height: 0,
    postBy: '',
    numNice: 0,
    niceByList: [],
    thms: [],
    postAt: new firebase.firestore.Timestamp(0, 0),
  },
  anss1: [],
  anss2: [],
  anss3: [],
};

export const postedReducer: Reducer<PostedScreen> = reducerWithInitialState(
  initialState,
)
  .case(startFetch, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
  }))
  .case(getAnss, (state, payload) => ({
    ...state,
    isFetching: false,
    anss1: payload.anss1,
    anss2: payload.anss2,
    anss3: payload.anss3,
  }))
  .case(getMoreAnss1, (state, payload) => {
    const updated = state.anss1.concat(payload);

    return {
      ...state,
      isFetching: false,
      anss1: updated,
    };
  })
  .case(getParams, (state, payload) => ({
    ...state,
    ppram: {
      postDoc: payload.postDoc,
      uri: payload.uri,
      width: payload.width,
      height: payload.height,
      postBy: payload.postBy,
      numNice: state.ppram.numNice,
      niceByList: state.ppram.niceByList,
      thms: payload.thms,
      postAt: payload.postAt,
    },
  }))
  .case(getNice, (state, payload) => ({
    ...state,
    doneNice: payload.isNiced,
    ppram: {
      ...state.ppram,
      numNice: payload.numNice,
      niceByList: payload.niceByList,
    },
  }))
  .case(postExist, (state, payload) => ({
    ...state,
    postExist: payload.postExist,
  }));

// detail screen

const initialDetail: DetailScreen = {
  isFetching: false,
  isError: false,
  ansExist: true,
  dpram: {
    postDoc: '',
    ansDoc: '',
    uri: '',
    width: 0,
    height: 0,
    thms: [],
    order: 1,
    body: '',
    numNice: 0,
    postBy: '',
    ansBy: '',
    postAt: new firebase.firestore.Timestamp(0, 0),
    ansAt: new firebase.firestore.Timestamp(0, 0),
  },
  numGotit: 0,
  gotitByList: [],
  comments: [],
  mLinks: [],
  fLinks: [],
  tLinks: [],
  links: [],
  doneGotit: false,
};

export const detailReducer: Reducer<DetailScreen> = reducerWithInitialState(
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
    doneGotit: payload.isGotit,
  }))
  .case(getComments, (state, payload) => ({
    ...state,
    comments: payload,
  }))
  .case(getLinks, (state, payload) => {
    console.log('{ payload }');
    console.log({ payload });
    const mUpdated = state.mLinks.concat(payload.mpin);
    const fUpdated = state.fLinks.concat(payload.fpin);
    const tUpdated = state.tLinks.concat(payload.tpin);
    const updated = state.mLinks.concat(payload.links);

    return {
      ...state,
      isFetching: false,
      mLinks: mUpdated,
      fLinks: fUpdated,
      tLinks: tUpdated,
      links: updated,
    };
  })
  .case(ansExist, (state, payload) => ({
    ...state,
    ansExist: payload.ansExist,
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
    isDone: false,
  }))
  .case(error, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: true,
    isDone: false,
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
