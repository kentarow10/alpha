import { actionCreatorFactory } from 'typescript-fsa';

// 準備

const actionCreator = actionCreatorFactory('MGR');

// plain Actions

export const mypinModeOn = actionCreator<{}>('MYPIN_MODE_ON');

export const mypinModeOff = actionCreator<{}>('MYPIN_MODE_OFF');
