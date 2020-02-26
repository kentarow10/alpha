import { Post, Ans, Comb } from '../types';

export type Me = {
  isLoading: boolean;
  isError: boolean;
  isImgError: boolean;
  userName: string;
  iconPath?: string;
  siBody: string;
  myCombs: Comb[];
  myPosts: Post[];
};

// export * from './actions';
// export * from './selectors';
// export { default } from './reducers';
