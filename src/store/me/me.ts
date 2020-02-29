import { Post, Ans, Comb } from '../types';

export type Me = {
  isFetching: boolean;
  isError: boolean;
  isImgError: boolean;
  showPostMode: boolean;
  userName: string;
  iconPath?: string;
  siBody: string;
  myCombs: Comb[];
  myPosts: Post[];
  myNicePosts: Post[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
