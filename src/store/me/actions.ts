import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Me } from './me';
import { Comb, Ans, Post, Comment, Nice, Pin } from '../types';
import { MyName } from './selector';

// 準備

const actionCreator = actionCreatorFactory('ME');

// Helper

async function getFromStorage(path: string) {
  const url = await storage.ref(path).getDownloadURL();

  return url;
}

// plain Actions

export const startFetch = actionCreator<{}>('START_FETCH');

export const endFetch = actionCreator<{}>('END_FETCH');

export const fetchError = actionCreator<{}>('FETCH_ERROR');

export const fetchImgError = actionCreator<{}>('FETCH_IMG_ERROR');

export const getMyInfo = actionCreator<{ userName: string; siBody: string }>(
  'GET_MY_INFO',
);

export const getIconUrl = actionCreator<{ iconUrl: string }>('GET_ICON_URL');

export const getMyPins = actionCreator<Comb[]>('GET_MY_PINS');

export const getMyPosts = actionCreator<Post[]>('GET_MY_POST');

export const getMyNicePosts = actionCreator<SimpleNice[]>('GET_MY_NICE_POST');

export const getMyGotitPins = actionCreator<Pin[]>('GET_MY_GOTIT_ANS');

export const getMyLinkedAnss = actionCreator<Comb[]>('GET_MY_LINKED_ANS');

export const updateSiBody = actionCreator<{ siBody: string }>('UPDATE_SIBODY');

// async Actions

// drawerの各項目から呼ばれる

// 自分がいいねした投稿一覧

export type SimpleNice = {
  postDoc: string;
  uri: string;
  postBy: string;
};

// 自分のいいねのリスン

export const listenMyNices = (uid: string) => {
  return async dispatch => {
    db.collection('users')
      .doc(uid)
      .collection('nices')
      .onSnapshot(snap => {
        const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
        console.log('listened change at ' + source);
        const niceList: SimpleNice[] = [];
        snap.forEach(post => {
          if (post.data().flag) {
            const postDoc = post.id;
            const uri = post.data().uri;
            const postBy = post.data().postBy;
            niceList.push({ postDoc, uri, postBy });
          }
        });
        dispatch(getMyNicePosts(niceList));
      });
  };
};

// 自分が分かる！した回答一覧

// export type SimplePin = {
//   ansDoc: string;
//   postDoc: string;
//   uri: string;
//   thms: string[];
//   order: number;
//   body: string;
//   ansBy?: string;
//   icon?: string;
// };

// 自分のわかる！のリスン

export const listenMyGotits = (uid: string) => {
  return async dispatch => {
    db.collection('users')
      .doc(uid)
      .collection('gotits')
      .onSnapshot(snap => {
        const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
        console.log('listened change at ' + source);
        const gotitList: Pin[] = [];
        snap.forEach(ans => {
          if (ans.data().flag) {
            const ansDoc = ans.id;
            const postDoc = ans.data().postDoc;
            const uri = ans.data().uri;
            const thm = ans.data().thm;
            const body = ans.data().body;
            const ansBy = ans.data().ansBy;
            gotitList.push({ ansDoc, postDoc, uri, thm, body, ansBy });
          }
        });
        dispatch(getMyGotitPins(gotitList));
      });
  };
};

export const asyncGetMyGotitPins = (uid: string) => {
  return async dispatch => {
    const gotits = await rtdb.ref(uid + '/gotits').once('value');
    const ansDoc = Object.keys(gotits);
    const gotitsList: Pin[] = ansDoc.map(ad => {
      const postDoc = gotits[ad].postDoc;
      const uri = gotits[ad].uri;
      const thm = gotits[ad].thm;
      const body = gotits[ad].body;
      const ansBy = gotits[ad].ansBy;

      return { ansDoc: ad, postDoc, uri, thm, body, ansBy };
    });
    dispatch(getMyGotitPins(gotitsList));
  };
};

// ほかのユーザーからリンクされた自分の回答一覧

export const asyncGetMyLinkedAnss = (uid: string) => {
  // return dispatch => {
  //   rtdb
  //     .ref('/' + uid + '/linked/')
  //     .once('value')
  //     .then(snap => {
  //       console.log(snap.val());
  //       const linkeds = snap.val();
  //       const combs: Comb[] = [];
  //       for (const ansd in linkeds) {
  //         const postDoc = linkeds[ansd].postDoc;
  //         const uri = linkeds[ansd].uri;
  //         const thm = linkeds[ansd].thm;
  //         const body = linkeds[ansd].body;
  //         const comb: Comb = {
  //           ansDoc: ansd,
  //           postDoc,
  //           uri,
  //           thm,
  //           ans: body,
  //         };
  //         combs.push(comb);
  //       }
  //       dispatch(getMyLinkedAnss(combs));
  //     });
  // };
};

// プロフィール画面から呼ばれる

// プロフィール画面初期化

export const asyncGetMyPosts = (uid: string) => {
  return dispatch => {
    dispatch(startFetch({}));
    db.collection('posts')
      .where('postBy', '==', uid)
      .get()
      .then(snap => {
        const posts: Post[] = [];
        snap.forEach(doc => {
          const thms = doc.data().thms;
          const owner = doc.data().postedBy;
          const width = doc.data().w;
          const height = doc.data().h;
          const createdAt = doc.data().postAt.toDate();
          storage
            .ref(doc.data().path)
            .getDownloadURL()
            .then(function(uri) {
              posts.push({
                postDoc: doc.id,
                uri,
                path: doc.data().path,
                thms,
                owner,
                width,
                height,
                postedAt: createdAt,
              });
            })
            .catch(e => {
              dispatch(fetchError({}));
            });
          dispatch(getMyPosts(posts));
        });
      })
      .catch(e => {
        console.log(e);
        dispatch(fetchError({}));
      });
  };
};

// 自分のピン一覧取得

export const asyncGetMyPins = (uid: string) => {
  return dispatch => {
    dispatch(startFetch({}));
    const anss = db.collectionGroup('answers').where('ansBy', '==', uid);
    anss.get().then(snap => {
      const myanss: Pin[] = [];
      snap.forEach(doc => {
        const ans: Pin = {
          postDoc: doc.data().postDoc,
          ansDoc: doc.id,
          uri: doc.data().uri,
          thms: doc.data().thms,
          order: doc.data().order,
          body: doc.data().body,
          postBy: doc.data().postedBy,
          ansBy: doc.data().ansBy,
          postAt: doc.data().postedAt,
          ansAt: doc.data().ansAt,
        };
        myanss.push(ans);
      });
      dispatch(getMyPins(myanss));
    });
  };
};

export const asyncGetMyInfo = (uid: string) => {
  return dispatch => {
    console.log(uid);
    db.collection('users')
      .doc(uid)
      .get()
      .then(function(doc) {
        const userName = doc.data().name;
        const iconPath = doc.data().iconPath;
        const siBody = doc.data().siBody;
        if (!iconPath) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const noimg = Asset.fromModule(require('../../../assets/icon.png'))
            .uri;
          console.log(noimg);
          dispatch(getIconUrl({ iconUrl: noimg }));
        } else {
          getFromStorage(iconPath)
            .then(url => {
              dispatch(getIconUrl(url));
            })
            .catch(e => {
              dispatch(fetchImgError({}));
            });
        }

        dispatch(getMyInfo({ userName, siBody }));
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  };
};

export const asyncUpdateSib = (uid: string, text: string) => {
  return dispatch => {
    dispatch(startFetch({}));
    db.collection('users')
      .doc(uid)
      .update({
        siBody: text,
      })
      .then(() => {
        dispatch(endFetch({}));
        dispatch(updateSiBody({ siBody: text }));
      });
  };
};
