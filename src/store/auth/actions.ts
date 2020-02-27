import { Dispatch } from 'redux';
import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage } from '../../../firebase/firebase';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Auth } from './auth';
import { Comb, Ans, Post, Comment } from '../types';

// preparation

const actionCreator = actionCreatorFactory('AUTH');

// plain actions

export const trnStart = actionCreator<{}>('TRN_START');

export const trnError = actionCreator<{}>('TRN_ERROR');

export const setUserInfo = actionCreator<{
  isFirst: number;
  uid: string;
  userName: string;
}>('SET_USER_INFO');

// helpers

export const initDb = (uid: string, dispatch: Dispatch<any>) => {
  console.log(FileSystem.documentDirectory + 'SQLite/');
  const db = SQLite.openDatabase('alpha_app');
  dispatch(trnStart());

  db.transaction(
    tx => {
      tx.executeSql('select * from users', null, (_, resultSet) => {
        if (resultSet.rows.length === 0) {
          tx.executeSql(
            'create table users (id integer primary key not null, isFirst integer, uid text, userName text);',
            null,
            () => {
              console.log('success');
            },
            e => {
              console.log(e);

              return true;
            },
          );
          tx.executeSql(
            'insert into users (isFirst, uid, userName) values (?,?,?)',
            [1, uid, 'ああああ'],
            () => {
              console.log('success');
              const isFirst = 1;
              const userName = 'ああああ';

              dispatch(setUserInfo({ isFirst, uid, userName }));
            },
            e => {
              console.log(e);

              return true;
            },
          );
        } else {
          console.log('exists');
          const isFirst = resultSet.rows.item(0).isFirst;
          const uid = resultSet.rows.item(0).uid;
          const userName = resultSet.rows.item(0).userName;

          dispatch(setUserInfo({ isFirst, uid, userName }));
        }
      });
    },
    e => {
      console.log(e);
      dispatch(trnError());
    },
    () => {
      console.log('success');
    },
  );
};

// async actions
