import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Me } from './me';

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
  updateHomeImage,
  updateIconImage,
  updateCardImage,
  updateName,
  updateSiBody,
  initEditScreen,
  getHomeUrl,
  doneEdit,
} from './actions';

const initialState: Me = {
  isFetching: false,
  isError: false,
  isImgError: false,
  showPostMode: false,
  userName: '',
  iconPath: '',
  homePath: '',
  siBody: '',
  myPins: [],
  myPosts: [],
  myNicePosts: [],
  myGotitPins: [],
  myLinkedPins: [],
  edit: {
    name: '',
    siBody: '',
    isCardUpdate: false,
    isIconUpdate: false,
    isHomeUpdate: false,
    done: false,
  },
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
  .case(getHomeUrl, (state, payload) => ({
    ...state,
    homePath: payload.homeUrl,
  }))
  .case(getMyPins, (state, payload) => ({
    ...state,
    isFetching: false,
    myPins: payload,
  }))
  .case(getMyPosts, (state, payload) => {
    console.log('aaaaaa00000');
    console.log(payload);

    return {
      ...state,
      isFetching: false,
      myPosts: payload,
    };
  })
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
  }))
  .case(updateHomeImage, (state, payload) => {
    return {
      ...state,
      edit: {
        ...state.edit,
        homeUri: payload.uri,
        homeName: payload.filename,
        isHomeUpdate: true,
      },
    };
  })
  .case(updateIconImage, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      iconUri: payload.uri,
      iconName: payload.filename,
      isIconUpdate: true,
    },
  }))
  .case(updateCardImage, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      cardUri: payload.uri,
      cardName: payload.filename,
      isCardUpdate: true,
    },
  }))
  .case(updateName, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      name: payload,
    },
  }))
  .case(updateSiBody, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      siBody: payload,
    },
  }))
  .case(initEditScreen, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      homeUri: payload.homeUri,
      iconUri: payload.iconUri,
      done: false,
    },
  }))
  .case(doneEdit, (state, payload) => ({
    ...state,
    edit: {
      ...state.edit,
      done: true,
    },
  }));

export default reducer;
