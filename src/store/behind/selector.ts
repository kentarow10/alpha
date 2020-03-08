import { createSelector } from 'reselect';
import { State } from '../store';

import { Posted } from './behind';

export const PostedState = createSelector<State, Posted, Posted>(
  (state: State) => state.postedReducer,
  (posted: Posted) => posted, // 最終的にここが返される
);
