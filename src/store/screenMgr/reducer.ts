import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ScreenMgr } from './mgr';
import {
  mypinModeOn,
  mypinModeOff,
  getNavState,
  getRootNavigation,
  reFetch,
} from './actions';

const initialState: ScreenMgr = {
  mypinMode: false,
  reFetched: false,
  navState: null,
  rootNav: null,
};

export const screenMgr: Reducer<ScreenMgr> = reducerWithInitialState(
  initialState,
)
  .case(mypinModeOn, (state, payload) => ({
    ...state,
    mypinMode: true,
  }))
  .case(mypinModeOff, (state, payload) => ({
    ...state,
    mypinMode: false,
  }))
  .case(reFetch, (state, payload) => ({
    ...state,
    mypinMode: !state.reFetched,
  }))
  .case(getNavState, (state, payload) => ({
    ...state,
    navState: payload.navState,
  }))
  .case(getRootNavigation, (state, payload) => ({
    ...state,
    rootNav: payload.rootNav,
  }));
