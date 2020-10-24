import { Post, Pin, NicePost, GotitPin, LinkPin } from '../types';
import { SimpleNice } from './actions';

type EditProf = {
  iconUri?: string;
  iconName?: string;
  isIconUpdate?: boolean;
  homeUri?: string;
  homeName?: string;
  isHomeUpdate?: boolean;
  cardUri?: string;
  cardName?: string;
  isCardUpdate?: boolean;
  name: string;
  siBody: string;
  done: boolean;
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
