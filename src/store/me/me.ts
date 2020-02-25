import { Post, Ans, Comb } from '../types';

export type Me = {
  uid: string;
  username: string;
  siBody: string;
  myPosts: Post[];
  myAnss: Ans[];
  myCombs: Comb[];
};

// export * from './actions';
// export * from './selectors';
// export { default } from './reducers';
