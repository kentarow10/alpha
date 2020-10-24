import { createSelector } from 'reselect';
import { State } from '../store';

import { ScreenMgr } from './mgr';

export const ScreenMgrState = createSelector<State, ScreenMgr, ScreenMgr>(
  (state: State) => state.screenMgr,
  (screenMgr: ScreenMgr) => screenMgr, // 最終的にここが返される
);
