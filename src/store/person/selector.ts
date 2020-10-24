import { createSelector } from 'reselect';
import { State } from '../store';

import { Me } from '../me/me';

export const GetAllPerson = createSelector<State, Me, Me>(
  (state: State) => state.me,
  (me: Me) => me, // 最終的にここが返される
);
