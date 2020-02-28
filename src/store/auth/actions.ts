import { Dispatch } from 'redux';
import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import firebase, { db, storage } from '../../../firebase/firebase';
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

export const autoLogin = (dispatch: Dispatch<any>) => {
  const db = SQLite.openDatabase('alpha_app');
  dispatch(trnStart({}));

  db.transaction(tx => {
    tx.executeSql('select * from users', null, (_, resultSet) => {
      const authed = resultSet.rows.item(0).isFirst;
      if (authed === 0) {
        const uid = resultSet.rows.item(0).uid;
        const userName = resultSet.rows.item(0).userName;
        dispatch(setUserInfo({ isFirst: 0, uid, userName }));
      }
    });
  });
};

// async actions

export const login = (mail: string, pass: string) => {
  return dispatch => {
    dispatch(trnStart({}));
    const db = SQLite.openDatabase('alpha_app');
    firebase
      .auth()
      .signInWithEmailAndPassword(mail, pass)
      .then(res => {
        const uid = res.user.uid;
        db.transaction(tx => {
          tx.executeSql(
            'select * from users where uid = (?)',
            [uid],
            (_, resultSet) => {
              const authed = resultSet.rows.item(0).isFirst;
              const userName = resultSet.rows.item(0).userName;
              if (authed === 0) {
                dispatch(setUserInfo({ isFirst: 0, uid, userName }));
              } else {
                dispatch(setUserInfo({ isFirst: 1, uid, userName }));
              }
            },
          );
        });
      })
      .catch(e => {
        console.log(e);
        dispatch(trnError({}));
      });
  };
};

// 動作確認済
export const createUser2 = (mail: string, pass: string, name: string) => {
  return dispatch => {
    dispatch(trnStart({}));
    // const db = SQLite.openDatabase('alpha_app');
    firebase
      .auth()
      .createUserWithEmailAndPassword(mail, pass)
      .then(() => {
        console.log('success');
        dispatch(
          setUserInfo({
            isFirst: 1,
            uid: '',
            userName: name,
          }),
        );
      })
      .catch(e => {
        console.log(e);
        dispatch(trnError({}));
      });
  };
};

export const createUser = (mail: string, pass: string, name: string) => {
  return dispatch => {
    dispatch(trnStart({}));
    console.log('create user');
    const sq = SQLite.openDatabase('alpha_app');
    firebase
      .auth()
      .createUserWithEmailAndPassword(mail, pass)
      .then(res => {
        const uid = res.user.uid;
        sq.transaction(
          tx => {
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
              [1, uid, name],
              () => {
                dispatch(
                  setUserInfo({
                    isFirst: 1,
                    uid,
                    userName: name,
                  }),
                );
              },
              e => {
                console.log(e);
                dispatch(trnError({}));

                return true;
              },
            );
          },
          () => {
            console.log('fail all');
          },
          () => {
            console.log('success');
            db.collection('users')
              .doc(uid)
              .set({
                userName: name,
                iconPath: '',
                siBody: '',
              });
          },
        );
      });
  };
};
