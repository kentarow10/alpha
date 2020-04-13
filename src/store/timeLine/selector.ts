import { createSelector } from 'reselect';
import { State } from '../store';

import { TimeLimeScreen } from '../screenTypes';

export const GetPosts = createSelector<State, TimeLimeScreen, TimeLimeScreen>(
  (state: State) => state.timeline,
  (timeline: TimeLimeScreen) => timeline, // 最終的にここが返される
);
