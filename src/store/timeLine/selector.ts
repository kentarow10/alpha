import { createSelector } from 'reselect';
import { State } from '../store';

import { TimeLime } from './timeLine';

export const GetPosts = createSelector<State, TimeLime, TimeLime>(
  (state: State) => state.timeline,
  (timeline: TimeLime) => timeline, // 最終的にここが返される
);
