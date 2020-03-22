import { Post, Ans, Pin, Nice } from '../types';
import { SimpleNice, SimplePin } from './actions';

export type Me = {
  isFetching: boolean;
  isError: boolean;
  isImgError: boolean;
  userName: string;
  iconPath?: string;
  siBody: string;
  showPostMode: boolean;
  myPins: Pin[];
  myPosts: Post[];
  myNicePosts: SimpleNice[];
  myGotitPins: SimplePin[];
  myLinkedPins: Pin[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
