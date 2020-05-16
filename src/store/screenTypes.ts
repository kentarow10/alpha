import { Pin, Comment, LinkPin, Post } from './types';

export type TimeLimeScreen = {
  isFetching: boolean;
  isError: boolean;
  refetch: boolean;
  posts: Post[];
};

export type PostedScreen = {
  isFetching: boolean;
  isError: boolean;
  doneNice: boolean;
  ppram: Post;
  anss1: Pin[];
  anss2: Pin[];
  anss3: Pin[];
};

export type DetailScreen = {
  isFetching: boolean;
  isError: boolean;
  dpram: Pin;
  numGotit: number;
  gotitByList: string[];
  comments: Comment[];
  mLinks: LinkPin[];
  tLinks: LinkPin[];
  fLinks: LinkPin[];
  links: LinkPin[];
  doneGotit: boolean;
};

export type PostScreen = {
  isFetching: boolean;
  isError: boolean;
  isDone: boolean;
  thm: string[];
  url: string;
  width: number;
  height: number;
  imageName: string;
};

export type AnsScreen = {
  isFetching: boolean;
  isError: boolean;
  isDone: boolean;
};
