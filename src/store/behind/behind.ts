import { Ans, PostedParams } from '../types';

export type Posted = {
  isFetching: boolean;
  isError: boolean;
  ppram: PostedParams;
  anss: Ans[];
};
