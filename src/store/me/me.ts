import { Post, Pin, NicePost, GotitPin, LinkPin } from '../types';
import { SimpleNice } from './actions';

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
  myNicePosts: NicePost[];
  myGotitPins: GotitPin[];
  myLinkedPins: LinkPin[];
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
