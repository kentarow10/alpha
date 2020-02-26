import { actionCreatorFactory } from 'typescript-fsa';
import { db, storage } from '../../../firebase/firebase';
import * as SQLite from 'expo-sqlite';
import { Me } from './me';
import { Comb, Ans, Post, Comment } from '../types';

// 準備

const SQ = SQLite.openDatabase('alpha_app');

async function getFromStorage(path: string) {
  try {
    const url = await storage.ref(path).getDownloadURL();

    return url;
  } catch (e) {
    switch (e.code) {
      // FIX ME
      // storageから取れなかったということをdispatchする。
      case 'storage/object-not-found':
        alert('storage/object-not-found');
        break;
      case 'storage/unauthorized':
        alert('storage/unauthorized');
        break;
      case 'storage/canceled':
        alert('storage/canceled');
        break;
      case 'storage/unknown':
        alert('storage/unknown');
        break;
    }
  }
}

const actionCreator = actionCreatorFactory('TODO');

// plain Actions

export const getMyInfo = actionCreator<{ userName: string; siBody: string }>(
  'GET_MY_INFO',
);

export const getIconUrl = actionCreator<{ iconUrl: string }>('GET_ICON_URL');

export const getMyCombs = actionCreator<{ combs: Comb[] }>('GET_MY_COMB');

export const getMyPosts = actionCreator<{ posts: Post[] }>('GET_MY_POST');

// async Actions

export const asyncGetMyInfo = (uid: string) => {
  return dispatch => {
    db.collection('users')
      .doc(uid)
      .get()
      .then(function(doc) {
        const userName = doc.data().userName;
        const iconPath = doc.data().iconPath;
        const siBody = doc.data().siBody;
        getFromStorage(iconPath).then(url => {
          dispatch(getIconUrl(url));
        });

        return { userName, siBody };
      })
      .then(myInfo => {
        dispatch(getMyInfo(myInfo));
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  };
};

export const asyncGetMyCombs = (uid: string) => {
  return dispatch => {
    db.collection('combs')
      .where('user', '==', uid)
      .get()
      .then(docs => {
        const myCombs: Comb[] = [];
        docs.forEach(doc => {});
      });
  };
};

export const asyncGetMyPosts = (uid: string) => {
  return dispatch => {
    db.collection('posts')
      .where('user', '==', uid)
      // thunkでこのuidは保持されているのか？
      .get()
      .then(function(querySnapshot) {
        const myposts: Post[] = [];
        querySnapshot.forEach(function(doc) {
          const id = doc.id;
          const numnice = doc.data().numnice;
          const numthm = doc.data().numthm;
          const thm1 = doc.data().thm1;
          const thm2 = doc.data().thm2;
          const thm3 = doc.data().thm3;
          storage
            .ref(doc.data().path)
            .getDownloadURL()
            .then(function(url) {
              myposts.push({
                doc: doc.id,
                path: url,
                thm: [thm1, thm2, thm3],
                ownerId: uid,
                numNice: numnice,
                createdAt: '',
              });
            })
            .catch(function(error) {
              switch (error.code) {
                case 'storage/object-not-found':
                  alert('storage/object-not-found');
                  break;
                case 'storage/unauthorized':
                  alert('storage/unauthorized');
                  break;
                case 'storage/canceled':
                  alert('storage/canceled');
                  break;
                case 'storage/unknown':
                  alert('storage/unknown');
                  break;
              }
            });
        });

        return myposts;
      })
      .then(myposts => {
        dispatch(getMyPosts(myposts));
      });
  };
};

// const simpleLogin = user => ({ type: LOGIN, user });

// const fetchSomeThing = (url) => {
//     return (dispatch) => {
//       // リクエスト開始のActionをdispatch
//       dispatch(requestData(url));

//       return fetch(url)
//         .then(res => {
//           if (!res.ok) {
//             return Promise.resolve(new Error(res.statusText));
//           }
//           return res.json();
//         })
//         .then(json => {
//           // レスポンスの受け取り（リクエスト成功）のActionをdispatch
//           dispatch(receiveData(json))
//         })
//         .catch(error => {
//           // リクエスト失敗のActionをdispatch
//           dispatch(failReceiveData(error));
//         });
//     }
//   };
