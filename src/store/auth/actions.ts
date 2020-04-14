import { Dispatch } from 'redux';
import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import FireBase, { db, storage, rtdb } from '../../../firebase/firebase';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { AsyncStorage } from 'react-native';

// preparation

const actionCreator = actionCreatorFactory('AUTH');

// plain actions

export const trnStart = actionCreator<{}>('TRN_START');

export const trnError = actionCreator<{}>('TRN_ERROR');

export const setUserInfo = actionCreator<{
  isFirst: number;
  uid: string;
  accountName: string;
}>('SET_USER_INFO');

// helpers

// async actions

export const login = (mail: string, pass: string) => {
  return dispatch => {
    dispatch(trnStart({}));
    // const db = SQLite.openDatabase('alpha_app');
    FireBase.auth()
      .signInWithEmailAndPassword(mail, pass)
      .then(res => {
        // dispatch(trnError({}));
        const uid = res.user.uid;
        dispatch(setUserInfo({ isFirst: 0, uid, accountName: '' }));
        // db.transaction(tx => {
        //   tx.executeSql(
        //     'select * from users where uid = (?)',
        //     [uid],
        //     (_, resultSet) => {
        //       const authed = resultSet.rows.item(0).isFirst;
        //       const userName = resultSet.rows.item(0).userName;
        //       if (authed === 0) {
        //         dispatch(setUserInfo({ isFirst: 0, uid, userName }));
        //       } else {
        //         dispatch(setUserInfo({ isFirst: 1, uid, userName }));
        //       }
        //     },
        //   );
        // });
      })
      .catch(e => {
        console.log(e);
        dispatch(trnError({}));
      });
  };
};

export const asyncAutoLogin = () => {
  return async dispatch => {
    dispatch(trnStart({}));
    const isLogin = await AsyncStorage.getItem('userToken');
    console.log({ isLogin });

    FireBase.auth().onAuthStateChanged(function(user) {
      if (isLogin && user) {
        dispatch(
          setUserInfo({ isFirst: 0, uid: user.uid, accountName: isLogin }),
        );
      } else {
        dispatch(setUserInfo({ isFirst: 0, uid: '', accountName: '' }));
      }
    });
  };
};

export const createUser = (
  mail: string,
  pass: string,
  name: string,
  account: string,
) => {
  return async dispatch => {
    console.log('create user');
    dispatch(trnStart({}));
    await AsyncStorage.setItem('userToken', account);
    FireBase.auth()
      .setPersistence(FireBase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        FireBase.auth()
          .createUserWithEmailAndPassword(mail, pass)
          .then(res => {
            const uid = res.user.uid;

            const userRef = rtdb.ref(uid);
            userRef.set({ name, account });
            const uref = db.collection('users').doc(uid);

            // uref
            //   .collection('nices')
            //   .doc('samplePostDocument')
            //   .set({ flag: true });
            // uref
            //   .collection('gotits')
            //   .doc('sampleAnsDocument')
            //   .set({ flag: true });
            uref
              .set({
                name,
                account,
                iconPath: '',
                siBody: '',
              })
              .then(() => {
                dispatch(
                  setUserInfo({ isFirst: 0, uid, accountName: account }),
                );
              })
              .catch(e => {
                alert(e);
              });
          })
          .then(() => {
            alert('登録完了しました！');
          })
          .catch(e => {
            alert(e);
          });
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
};
