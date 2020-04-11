import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import firebase from '../../../firebase/firebase';

import { Posted, Detail, PostScreen, AnsScreen } from './behind';
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
} from './actions';

// posted screen

const initialState: Posted = {
  isFetching: false,
  isError: false,
  doneNice: false,
  ppram: {
    postDoc: '',
    uri: '',
    width: 0,
    height: 0,
    owner: '',
    numNice: 0,
    niceByList: [],
    thms: [],
    createdAt: new firebase.firestore.Timestamp(0, 0),
  },
  anss1: [],
  anss2: [],
  anss3: [],
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
      owner: payload.owner,
      numNice: state.ppram.numNice,
      niceByList: state.ppram.niceByList,
      thms: payload.thms,
      createdAt: payload.createdAt,
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
    postedAt: new firebase.firestore.Timestamp(0, 0),
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
    doneGotit: payload.isGotit,
  }))
  .case(getComments, (state, payload) => ({
    ...state,
    comments: payload,
  }))
  .case(getLinks, (state, payload) => ({
    ...state,
    mLinks: payload.mpin,
    fLinks: payload.fpin,
    tLinks: payload.tpin,
    links: payload.links,
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
