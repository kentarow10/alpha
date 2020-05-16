import {
  NavigationProp,
  DrawerNavigationState,
} from '@react-navigation/native';

export type ScreenMgr = {
  mypinMode: boolean;
  reFetched: boolean;
  navState: DrawerNavigationState;
  rootNav: NavigationProp<Record<string, object>, string, any, any, {}>;
};

export const cls = {
  grn: '#00A85A',
  rd: '#F98A8A',
  yl: '#FAFA89',
  sky: '89FAFA',
  off: '#e5e5e5',
  dpgr: '#5DA797',
};

export * from './actions';
export * from './selector';
export { screenMgr } from './reducer';
