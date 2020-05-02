import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Me } from './me';
import { Post, NicePost, Pin, GotitPin, LinkPin } from '../types';
import { MyName } from './selector';

import * as ImagePicker from 'expo-image-picker';
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
export const getHomeUrl = actionCreator<{ homeUrl: string }>('GET_HOME_URL');

export const getMyPins = actionCreator<Pin[]>('GET_MY_PINS');

export const getMyPosts = actionCreator<Post[]>('GET_MY_POST');

export const getMyNicePosts = actionCreator<NicePost[]>('GET_MY_NICE_POST');

export const getMyGotitPins = actionCreator<GotitPin[]>('GET_MY_GOTIT_ANS');

export const getMyLinkedAnss = actionCreator<LinkPin[]>('GET_MY_LINKED_ANS');

export const updateSiBody = actionCreator<string>('UPDATE_SIBODY');
export const updateName = actionCreator<string>('UPDATE_NAME');
export const updateHomeImage = actionCreator<{ uri: string; filename: string }>(
  'UPDATE_HOME_IMAGE',
);
export const updateIconImage = actionCreator<{ uri: string; filename: string }>(
  'UPDATE_ICON_IMAGE',
);
export const updateCardImage = actionCreator<{ uri: string; filename: string }>(
  'UPDATE_CARD_IMAGE',
);
export const initEditScreen = actionCreator<{
  homeUri: string;
  iconUri: string;
}>('INIT_EDIT_SCREEN');
export const doneEdit = actionCreator<{}>('EDIT_DONE');

// async Actions

// drawerの各項目から呼ばれる

// 自分がいいねした投稿一覧

export type SimpleNice = {
  postDoc: string;
  uri: string;
  postBy: string;
};

// 自分のいいねのリスン

// export const listenMyNices = (uid: string) => {
//   return async dispatch => {
//     db.collection('users')
//       .doc(uid)
//       .collection('nices')
//       .onSnapshot(snap => {
//         const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
//         console.log('listened change at ' + source);
//         const niceList: NicePost[] = [];
//         snap.forEach(post => {
//           if (post.data().flag) {
//             const postDoc = post.id;
//             const uri = post.data().uri;
//             const postBy = post.data().postBy;
//             niceList.push({ postDoc, uri, postBy });
//           }
//         });
//         dispatch(getMyNicePosts(niceList));
//       });
//   };
// };

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

// export const listenMyGotits = (uid: string) => {
//   return async dispatch => {
//     db.collection('users')
//       .doc(uid)
//       .collection('gotits')
//       .onSnapshot(snap => {
//         const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
//         console.log('listened change at ' + source);
//         const gotitList: Pin[] = [];
//         snap.forEach(ans => {
//           if (ans.data().flag) {
//             const ansDoc = ans.id;
//             const postDoc = ans.data().postDoc;
//             const uri = ans.data().uri;
//             const thm = ans.data().thm;
//             const body = ans.data().body;
//             const ansBy = ans.data().ansBy;
//             gotitList.push({ ansDoc, postDoc, uri, thm, body, ansBy });
//           }
//         });
//         dispatch(getMyGotitPins(gotitList));
//       });
//   };
// };

// export const asyncGetMyGotitPins = (uid: string) => {
//   return async dispatch => {
//     const gotits = await rtdb.ref(uid + '/gotits').once('value');
//     const ansDoc = Object.keys(gotits);
//     const gotitsList: Pin[] = ansDoc.map(ad => {
//       const postDoc = gotits[ad].postDoc;
//       const uri = gotits[ad].uri;
//       const thm = gotits[ad].thm;
//       const body = gotits[ad].body;
//       const ansBy = gotits[ad].ansBy;

//       return { ansDoc: ad, postDoc, uri, thm, body, ansBy };
//     });
//     dispatch(getMyGotitPins(gotitsList));
//   };
// };

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
          const postBy = doc.data().postBy;
          const width = doc.data().width;
          const height = doc.data().height;
          const postAt = doc.data().postAt.toDate();
          storage
            .ref(doc.data().path)
            .getDownloadURL()
            .then(function(uri) {
              posts.push({
                postDoc: doc.id,
                uri,
                path: doc.data().path,
                thms,
                postBy,
                width,
                height,
                postAt,
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
          width: doc.data().width,
          height: doc.data().height,
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
        const homePath = doc.data().homePath;
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
              console.log({ url });
              dispatch(getIconUrl({ iconUrl: url }));
            })
            .catch(e => {
              dispatch(fetchImgError({}));
            });
          getFromStorage(homePath)
            .then(url => {
              console.log({ url });
              dispatch(getHomeUrl({ homeUrl: url }));
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

// export const asyncUpdateSib = (uid: string, text: string) => {
//   return dispatch => {
//     dispatch(startFetch({}));
//     db.collection('users')
//       .doc(uid)
//       .update({
//         siBody: text,
//       })
//       .then(() => {
//         dispatch(endFetch({}));
//         dispatch(updateSiBody({ siBody: text }));
//       });
//   };
// };

// android Only
const aspectDict = {
  home: [1.414, 1],
  icon: [1, 1],
  card: [1, 1],
};

export const asyncChooseImage = (kind: keyof typeof aspectDict) => {
  return dispatch => {
    console.log('called');
    console.log(aspectDict[kind]);
    ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: aspectDict[kind] as [number, number],
    })
      .then(res => {
        if (!res.cancelled) {
          const uriList = res.uri.split('/');
          const filename = uriList.pop();
          if (kind === 'home') {
            console.log(res.uri);
            console.log({ filename });
            dispatch(updateHomeImage({ uri: res.uri, filename }));
          } else if (kind === 'icon') {
            dispatch(updateIconImage({ uri: res.uri, filename }));
          } else {
            dispatch(updateCardImage({ uri: res.uri, filename }));
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export const asyncSaveProfile = (
  uid: string,
  name: string,
  siBody: string,
  homeUrl: string,
  homeName: string,
  isHomeUpdate: boolean,
  iconUrl: string,
  iconName: string,
  isIconUpdate: boolean,
) => {
  return async dispatch => {
    dispatch(startFetch({}));
    if (isHomeUpdate && isIconUpdate) {
      const res1 = await fetch(homeUrl);
      const blobHome = await res1.blob();
      const res2 = await fetch(iconUrl);
      const blobIcon = await res2.blob();
      const ref2 = storage.ref().child(`${uid}/icon/${iconName}`);
      ref2.put(blobIcon);
      const ref1 = storage.ref().child(`${uid}/home/${homeName}`);
      ref1.put(blobHome);
      db.collection('users')
        .doc(uid)
        .update({
          name,
          siBody,
          iconPath: `${uid}/icon/${iconName}`,
          homePath: `${uid}/home/${homeName}`,
        })
        .then(() => {
          dispatch(endFetch({}));
          dispatch(doneEdit({}));
        })
        .catch(e => {
          console.log(e);
        });
    } else if (isIconUpdate) {
      const res2 = await fetch(iconUrl);
      const blobIcon = await res2.blob();
      const ref2 = storage.ref().child(`${uid}/icon/${iconName}`);
      ref2.put(blobIcon);
      db.collection('users')
        .doc(uid)
        .update({
          name,
          siBody,
          iconPath: `${uid}/icon/${iconName}`,
        })
        .then(() => {
          dispatch(endFetch({}));
          dispatch(doneEdit({}));
        })
        .catch(e => {
          console.log(e);
        });
    } else if (isHomeUpdate) {
      const res1 = await fetch(homeUrl);
      const blobHome = await res1.blob();
      const ref1 = storage.ref().child(`${uid}/home/${homeName}`);
      ref1.put(blobHome);
      db.collection('users')
        .doc(uid)
        .update({
          name,
          siBody,
          homePath: `${uid}/home/${homeName}`,
        })
        .then(() => {
          dispatch(endFetch({}));
          dispatch(doneEdit({}));
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      db.collection('users')
        .doc(uid)
        .update({
          name,
          siBody,
        })
        .then(() => {
          dispatch(endFetch({}));
          dispatch(doneEdit({}));
        })
        .catch(e => {
          console.log(e);
        });
    }
    alert('プロフィールを更新しました！');
  };
};
