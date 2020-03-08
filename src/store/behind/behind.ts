import { PostedParams } from '../types';

export type Posted = {
  isFetching: boolean;
  isError: boolean;
  ppram: PostedParams;
  anss: any[];
};

export * from './actions';
export * from './selector';
export { postedReducer } from './reducer';
