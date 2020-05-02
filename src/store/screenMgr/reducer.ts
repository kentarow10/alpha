import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ScreenMgr } from './mgr';
import { mypinModeOn, mypinModeOff, getNavState } from './actions';

const initialState: ScreenMgr = {
  mypinMode: false,
  navState: null,
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
  .case(getNavState, (state, payload) => ({
    ...state,
    navState: payload.navState,
  }));
