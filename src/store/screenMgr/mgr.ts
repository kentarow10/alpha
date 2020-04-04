export type ScreenMgr = {
  mypinMode: boolean;
};

export const cls = {
  grn: '#00A85A',
  rd: '#F98A8A',
  off: '#e5e5e5',
  dpgr: '#5DA797',
};

export * from './actions';
export * from './selector';
export { screenMgr } from './reducer';
