import { Post, Ans, Comb, Nice } from '../types';
import { SimpleNice, SimplePin } from './actions';

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
  myNicePosts: SimpleNice[];
  myGotitPins: SimplePin[];
  myLinkedCombs: Comb[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
