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
  }));

export default reducer;
