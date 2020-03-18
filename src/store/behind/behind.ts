import {
  PostedParams,
  Ans,
  NavigationParamList,
  DetailParams,
  Comment,
} from '../types';
import { RouteProp } from '@react-navigation/native';

export type Posted = {
  isFetching: boolean;
  isError: boolean;
  ppram: PostedParams;
  anss: Ans[];
};

export type Detail = {
  isFetching: boolean;
  isError: boolean;
  dpram: DetailParams;
  numGotit: number;
  gotitByList: string[];
  comments: Comment[];
};

export type PostScreen = {
  addThm2: boolean;
  addThm3: boolean;
  thm: string[];
  url: string;
  width: number;
  height: number;
  imageName: string;
};

export type Behind = {
  isFetching: boolean;
  isError: boolean;
  ppram: PostedParams;
  anss: Ans[];
};

export * from './actions';
export * from './selector';
export { postedReducer, detailReducer, postReducer } from './reducer';
