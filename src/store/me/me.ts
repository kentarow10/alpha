import { Post, Ans, Comb, Nice } from '../types';

export type Me = {
  isFetching: boolean;
  isError: boolean;
  isImgError: boolean;
  userName: string;
  iconPath?: string;
  siBody: string;
  showPostMode: boolean;
  myCombs: Comb[];
  myPosts: Post[];
  myNicePosts: Nice[];
  myGotitCombs: Comb[];
  myLinkedCombs: Comb[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
