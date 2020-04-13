import { createSelector } from 'reselect';
import { State } from '../store';

import {
  PostedScreen,
  DetailScreen,
  PostScreen,
  AnsScreen,
} from '../screenTypes';

export const PostedState = createSelector<State, PostedScreen, PostedScreen>(
  (state: State) => state.postedReducer,
  (posted: PostedScreen) => posted, // 最終的にここが返される
);

export const DetailState = createSelector<State, DetailScreen, DetailScreen>(
  (state: State) => state.detailReducer,
  (detail: DetailScreen) => detail, // 最終的にここが返される
);

export const PostState = createSelector<State, PostScreen, PostScreen>(
  (state: State) => state.postReducer,
  (ps: PostScreen) => ps, // 最終的にここが返される
);

export const AnsState = createSelector<State, AnsScreen, AnsScreen>(
  (state: State) => state.ansReducer,
  (anss: AnsScreen) => anss, // 最終的にここが返される
);
