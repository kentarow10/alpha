import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { ScreenMgr } from './mgr';
import { mypinModeOn, mypinModeOff } from './actions';

const initialState: ScreenMgr = {
  mypinMode: false,
};

export const screenMgr: Reducer<ScreenMgr> = reducerWithInitialState(
  initialState,
)
  .case(mypinModeOn, (state, payload) => ({
    mypinMode: true,
  }))
  .case(mypinModeOff, (state, payload) => ({
    mypinMode: false,
  }));
