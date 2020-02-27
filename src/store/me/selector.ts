import { createSelector } from 'reselect';
import { State } from '../store';

import { Me } from './me';

export const GetAllMe = createSelector(
  (state: State) => state,
  (me: Me) => me,
);
