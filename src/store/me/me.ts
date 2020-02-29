import { Post, Ans, Comb, Nice } from '../types';

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
  myNicePosts: Nice[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
