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
    FireBase.auth()
      .signInWithEmailAndPassword(mail, pass)
      .then(res => {
        const uid = res.user.uid;

        db.collection('users')
          .doc(uid)
          .get()
          .then(async snap => {
            const account = snap.data().account;
            dispatch(setUserInfo({ isFirst: 0, uid, accountName: account }));
            await AsyncStorage.setItem('userToken', account);
          });
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
    const token = await AsyncStorage.getItem('userToken');
    let isLogin = true;
    if (token === 'false' || !token) {
      isLogin = false;
    }

    FireBase.auth().onAuthStateChanged(function(user) {
      if (isLogin && user) {
        dispatch(
          setUserInfo({ isFirst: 0, uid: user.uid, accountName: token }),
        );
      } else {
        dispatch(setUserInfo({ isFirst: 0, uid: '', accountName: '' }));
      }
    });
  };
};

export const asyncLogout = () => {
  return async dispatch => {
    dispatch(trnStart({}));
    await AsyncStorage.setItem('userToken', 'false');

    dispatch(setUserInfo({ isFirst: 0, uid: '', accountName: '' }));
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
            userRef.set({ account });
            const uref = db.collection('users').doc(uid);

            uref
              .set({
                name,
                account,
                iconPath: '',
                siBody: '',
                homePath: '',
                thankPath: '',
              })
              .then(() => {
                dispatch(
                  setUserInfo({ isFirst: 1, uid, accountName: account }),
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
        alert(errorCode);
        alert(errorMessage);
      });
  };
};
