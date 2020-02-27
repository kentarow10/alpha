import { Post, Ans, Comb } from '../types';

export type Auth = {
  isFetching: boolean;
  isError: boolean;
  isFirst: number; // 0がfalse,1がtrue。sqliteがbooleanを扱えないため。
  uid: string;
  userName: string;
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
