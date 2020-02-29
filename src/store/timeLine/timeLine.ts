import { Post, Ans, Comb, Nice } from '../types';

export type TimeLime = {
  isFetching: boolean;
  isError: boolean;
  posts: Post[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
