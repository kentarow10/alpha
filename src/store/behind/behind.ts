import { PostedParams, Ans, NavigationParamList, DetailParams } from '../types';
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
};

export * from './actions';
export * from './selector';
export { postedReducer, detailReducer } from './reducer';
