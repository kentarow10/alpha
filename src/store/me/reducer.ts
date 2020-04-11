import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { Me } from './me';
import { Ans, Post, Comment } from '../types';

import {
  getMyInfo,
  getIconUrl,
  getMyPosts,
  startFetch,
  endFetch,
  fetchImgError,
  fetchError,
  getMyNicePosts,
  getMyGotitPins,
  getMyLinkedAnss,
  getMyPins,
} from './actions';

const initialState: Me = {
  isFetching: false,
  isError: false,
  isImgError: false,
  showPostMode: false,
  userName: '',
  iconPath: '',
  siBody: '',
  myPins: [],
  myPosts: [],
  myNicePosts: [],
  myGotitPins: [],
  myLinkedPins: [],
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
    isFetching: false,
    userName: payload.userName,
    siBody: payload.siBody,
  }))
  .case(getIconUrl, (state, payload) => ({
    ...state,
    iconPath: payload.iconUrl,
  }))
  .case(getMyPins, (state, payload) => ({
    ...state,
    isFetching: false,
    myPins: payload,
  }))
  .case(getMyPosts, (state, payload) => ({
    ...state,
    isFetching: false,
    myPosts: payload,
  }))
  .case(getMyNicePosts, (state, payload) => ({
    ...state,
    isFetching: false,
    myNicePosts: payload,
  }))
  .case(getMyGotitPins, (state, payload) => ({
    ...state,
    isFetching: false,
    myGotitPins: payload,
  }))
  .case(getMyLinkedAnss, (state, payload) => ({
    ...state,
    isFetching: false,
    myLinkedPins: payload,
  }));

export default reducer;
