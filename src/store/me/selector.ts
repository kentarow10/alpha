import { createSelector } from 'reselect';
import { State } from '../store';

import { Me } from './me';

export const GetAllMe = createSelector<State, Me, Me>(
  (state: State) => state.me,
  (me: Me) => me, // 最終的にここが返される
);

export const MyName = createSelector<State, Me, string>(
  (state: State) => state.me,
  (me: Me) => me.userName,
);
