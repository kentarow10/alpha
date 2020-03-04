import { Post, Ans, Comb, Nice } from '../types';

export type Me = {
  userName: string;
  iconPath?: string;
  siBody: string;
  mescreen: MeScreen;
  nicesscreen: MyNiceScreen;
};

type MeScreen = {
  isFetching: boolean;
  isError: boolean;
  isImgError: boolean;
  showPostMode: boolean;
  myCombs: Comb[];
  myPosts: Post[];
};

type MyNiceScreen = {
  isFetching: boolean;
  isError: boolean;
  myNicePosts: Nice[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
