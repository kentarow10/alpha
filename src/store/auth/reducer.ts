import { Reducer } from 'redux';
import { isType } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { Auth } from './auth';
import { trnStart, trnError, setUserInfo } from './actions';

const initialState: Auth = {
  isFetching: false,
  isError: false,
  isFirst: 2, // 0がfalse,1がtrue。sqliteがbooleanを扱えないため。
  uid: '',
  userName: '',
};

const reducer: Reducer<Auth> = reducerWithInitialState(initialState)
  .case(trnStart, (state, payload) => ({
    ...state,
    isFetching: true,
  }))
  .case(trnError, (state, payload) => ({
    ...state,
    isFetching: false,
    isError: true,
  }))
  .case(setUserInfo, (state, payload) => ({
    ...state,
    isFirst: payload.isFirst,
    uid: payload.isFirst,
    userName: payload.userName,
  }));

export default reducer;
