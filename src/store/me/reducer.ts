import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';

import { Me } from './me';
import { Add, ChangeStatus, Delete } from '..';

const initialState: Me = {
  uid: '',
  username: '',
  siBody: '',
  myPosts: [],
  myAnss: [],
  myCombs: [],
};

export const reducer: Reducer<Me> = (state = initialState, action) => {
  //   if (isType(action, Add)) {
  //     return produce(state, draft => {
  //       draft.push({ title: action.payload.title, status: 'not yet' });
  //     });
  //   }
  //   if (isType(action, ChangeStatus)) {
  //     return produce(state, draft => {
  //       if (draft[action.payload.index].status === 'not yet') {
  //         draft[action.payload.index].status = 'done';
  //       } else {
  //         draft[action.payload.index].status = 'not yet';
  //       }
  //     });
  //   }
  //   if (isType(action, Delete)) {
  //     return produce(state, draft => {
  //       draft.splice(action.payload.index, 1);
  //     });
  //   }

  return state;
};

export default reducer;
