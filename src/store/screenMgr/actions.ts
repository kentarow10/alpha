import { actionCreatorFactory } from 'typescript-fsa';
import { DrawerNavigationState } from '@react-navigation/native';

// 準備

const actionCreator = actionCreatorFactory('MGR');

// plain Actions

export const mypinModeOn = actionCreator<{}>('MYPIN_MODE_ON');

export const mypinModeOff = actionCreator<{}>('MYPIN_MODE_OFF');

export const startProfileLoad = actionCreator<{}>('START_PROFILE_LOAD');
export const endProfileLoad = actionCreator<{}>('END_PROFILE_LOAD');

export const getNavState = actionCreator<{ navState: DrawerNavigationState }>(
  'GET_NAV_STATE',
);

export const getRootNavigation = actionCreator<{ rootNav: any }>(
  'GET_ROOT_NAV',
);

// Helper

export const omitText = (num: number, text: string): string => {
  if (text.length <= num) {
    return text;
  } else {
    const omitted = text.slice(0, num) + '...';

    return omitted;
  }
};
