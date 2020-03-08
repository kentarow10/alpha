import { createSelector } from 'reselect';
import { State } from '../store';

import { Posted, Detail } from './behind';

export const PostedState = createSelector<State, Posted, Posted>(
  (state: State) => state.postedReducer,
  (posted: Posted) => posted, // 最終的にここが返される
);

export const DetailState = createSelector<State, Detail, Detail>(
  (state: State) => state.detailReducer,
  (detail: Detail) => detail, // 最終的にここが返される
);
