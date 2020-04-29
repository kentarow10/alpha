import { Post, Pin, NicePost, GotitPin, LinkPin } from '../types';
import { SimpleNice } from './actions';

type EditProf = {
  iconUri?: string;
  iconName?: string;
  homeUri?: string;
  homeName?: string;
  cardUri?: string;
  cardName?: string;
  name: string;
  siBody: string;
};

export type Me = {
  isFetching: boolean;
  isError: boolean;
  isImgError: boolean;
  userName: string;
  iconPath?: string;
  homePath?: string;
  siBody: string;
  showPostMode: boolean;
  myPins: Pin[];
  myPosts: Post[];
  myNicePosts: NicePost[];
  myGotitPins: GotitPin[];
  myLinkedPins: LinkPin[];
  edit?: EditProf;
};

export * from './actions';
export * from './selector';
export { default } from './reducer';
