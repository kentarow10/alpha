import {
  PostedParams,
  Ans,
  NavigationParamList,
  DetailParams,
  Comment,
  Pin,
} from '../types';
import { RouteProp } from '@react-navigation/native';

export type Posted = {
  isFetching: boolean;
  isError: boolean;
  doneNice: boolean;
  ppram: PostedParams;
  anss1: Ans[];
  anss2: Ans[];
  anss3: Ans[];
};

export type Detail = {
  isFetching: boolean;
  isError: boolean;
  dpram: DetailParams;
  numGotit: number;
  gotitByList: string[];
  comments: Comment[];
  mLinks: Pin[];
  tLinks: Pin[];
  fLinks: Pin[];
  links: Pin[];
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

export type Behind = {
  isFetching: boolean;
  isError: boolean;
  ppram: PostedParams;
  anss: Ans[];
};

export * from './actions';
export * from './selector';
export {
  postedReducer,
  detailReducer,
  postReducer,
  ansReducer,
} from './reducer';
