import { createSelector } from 'reselect';
import { State } from '../store';

import { Auth } from './auth';

export const GetAuth = createSelector<State, Auth, Auth>(
  (state: State) => state.auth,
  (auth: Auth) => auth,
);
