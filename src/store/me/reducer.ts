import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Me } from './me';
import { Comb, Ans, Post, Comment } from '../types';

import {
  getMyInfo,
  getIconUrl,
  getMyCombs,
  getMyPosts,
  startFetch,
  endFetch,
  fetchImgError,
  fetchError,
  getMyNicePosts,
  getMyGotitPins,
  getMyLinkedAnss,
} from './actions';

const initialState: Me = {
  isFetching: false,
  isError: false,
  isImgError: false,
  showPostMode: false,
  userName: '',
  iconPath: '',
  siBody: '',
  myCombs: [],
  myPosts: [],
  myNicePosts: [],
  myGotitPins: [],
  myLinkedCombs: [],
};

const reducer: Reducer<Me> = reducerWithInitialState(initialState)
  .case(startFetch, (state, payload) => ({
    ...state,
    isFetching: true,
    isError: false,
    isImgError: false,
  }))
  .case(endFetch, (state, payload) => ({
    ...state,
    isFetching: false,
  }))
  .case(fetchError, (state, payload) => ({
    ...state,
    isError: true,
  }))
  .case(fetchImgError, (state, payload) => ({
    ...state,
    isImgError: true,
  }))
  .case(getMyInfo, (state, payload) => ({
    ...state,
    userName: payload.userName,
    siBody: payload.siBody,
  }))
  .case(getIconUrl, (state, payload) => ({
    ...state,
    iconPath: payload.iconUrl,
  }))
  .case(getMyCombs, (state, payload) => ({
    ...state,
    myCombs: payload,
  }))
  .case(getMyPosts, (state, payload) => ({
    ...state,
    myPosts: payload,
  }))
  .case(getMyNicePosts, (state, payload) => ({
    ...state,
    myNicePosts: payload,
  }))
  .case(getMyGotitPins, (state, payload) => ({
    ...state,
    myGotitPins: payload,
  }))
  .case(getMyLinkedAnss, (state, payload) => ({
    ...state,
    myLinkedCombs: payload,
  }));

export default reducer;
