import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import firebase, { db, storage, rtdb, func } from '../../../firebase/firebase';
import { Me } from './me';
import { Post, NicePost, Pin, GotitPin, LinkPin } from '../types';
import { MyName } from './selector';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import post from '../../behind/post';
import { startProfileLoad, endProfileLoad } from '../screenMgr/mgr';
import { Platform } from 'react-native';
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

export const registerForPushNotificationsAsync = (uid: string) => {
  return async dispatch => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS,
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS,
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');

        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      db.collection('users')
        .doc(uid)
        .set(
          {
            noteToken: token,
          },
          { merge: true },
        );
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };
};

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
        const niceList: NicePost[] = [];
        snap.forEach(post => {
          if (post.data().flag) {
            const np: NicePost = {
              postDoc: post.id,
              uri: post.data().uri,
              width: post.data().width,
              height: post.data().height,
              postAt: post.data().postAt,
              postBy: post.data().postBy,
              thms: post.data().thms,
              niceAt: post.data().niceAt,
              niceBy: post.data().niceBy,
            };
            niceList.push(np);
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
        const gotitList: GotitPin[] = [];
        snap.forEach(ans => {
          if (ans.data().flag) {
            const gp: GotitPin = {
              postDoc: ans.data().postDoc,
              postAt: ans.data().postAt,
              postBy: ans.data().postBy,
              uri: ans.data().uri,
              width: ans.data().width,
              height: ans.data().height,
              thms: ans.data().thms,
              order: ans.data().order,
              body: ans.data().body,
              ansDoc: ans.id,
              ansAt: ans.data().ansAt,
              ansBy: ans.data().ansBy,
              gotitAt: ans.data().gotitAt,
              gotitBy: ans.data().gotitBy,
            };
            gotitList.push(gp);
          }
        });
        dispatch(getMyGotitPins(gotitList));
      });
  };
};

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
    console.log('get my posts');
    db.collection('posts')
      .where('postBy', '==', uid)
      .get()
      .then(snap => {
        const posts: Post[] = [];
        snap.forEach(doc => {
          console.log(doc.data());
          const uri = doc.data().uri;
          const thms = doc.data().thms;
          const postBy = doc.data().postBy;
          const width = doc.data().width;
          const height = doc.data().height;
          const postAt = doc.data().postAt;

          posts.push({
            postDoc: doc.id,
            uri,
            thms,
            postBy,
            width,
            height,
            postAt,
          });

          dispatch(getMyPosts(posts));
        });
        console.log(posts.length);
      })
      .catch(e => {
        console.log(e);
        dispatch(fetchError({}));
      });
  };
};

// 自分のピン一覧取得

export const asyncGetMyPins = (uid: string) => {
  return async dispatch => {
    dispatch(startFetch({}));
    const ui = await db
      .collection('users')
      .doc(uid)
      .get();
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
          postBy: doc.data().postBy,
          ansBy: doc.data().ansBy,
          postAt: doc.data().postAt,
          ansAt: doc.data().ansAt,
          answer: ui.data().name,
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
              // console.log({ url });
              dispatch(getIconUrl({ iconUrl: url }));
            })
            .catch(e => {
              dispatch(fetchImgError({}));
            });
          getFromStorage(homePath)
            .then(url => {
              // console.log({ url });
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

export const deleteComments = async (postDoc: string, ansDoc: string) => {
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const ans = db
    .collection('posts')
    .doc(postDoc)
    .collection('answers')
    .doc(ansDoc);

  const deleteDoc = await ans.collection('comments').get();
  if (deleteDoc === undefined) {
    batchArray[0].commit();

    return;
  } else {
    deleteDoc.forEach(d => {
      batchArray[batchIndex].delete(ans.collection('comments').doc(d.id));
      operationCounter++;

      if (operationCounter === 499) {
        batchArray.push(db.batch());
        batchIndex++;
        operationCounter = 0;
      }
    });

    batchArray.forEach(async batch => await batch.commit());
  }
};

const deletePostInUsers = async (postDoc: string) => {
  console.log('delete post in users');
  const them = await db
    .collectionGroup('nices')
    .where('postDoc', '==', postDoc)
    .get();
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const parentUidList: string[] = [];
  them.forEach(d => {
    parentUidList.push(d.data().parent);
  });
  parentUidList.forEach(uid => {
    batchArray[batchIndex].delete(
      db
        .collection('users')
        .doc(uid)
        .collection('nices')
        .doc(postDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  batchArray.forEach(async batch => await batch.commit());
};

const deleteAnsInUsers = async (ansDoc: string) => {
  const them = await db
    .collectionGroup('gotits')
    .where('ansDoc', '==', ansDoc)
    .get();
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const parentUidList: string[] = [];
  them.forEach(d => {
    parentUidList.push(d.data().parent);
  });
  parentUidList.forEach(uid => {
    batchArray[batchIndex].delete(
      db
        .collection('users')
        .doc(uid)
        .collection('gotits')
        .doc(ansDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  batchArray.forEach(async batch => await batch.commit());
};

const deleteAnsInLinks = async (ansDoc: string) => {
  console.log('delete ans in links');
  const fromSnap = await db
    .collectionGroup('from')
    .where('ansDoc', '==', ansDoc)
    .get();
  const toSnap = await db
    .collectionGroup('to')
    .where('ansDoc', '==', ansDoc)
    .get();
  const mutualSnap = await db
    .collectionGroup('mutual')
    .where('ansDoc', '==', ansDoc)
    .get();
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const pfList: string[] = [];
  const ptList: string[] = [];
  const pmList: string[] = [];
  fromSnap.forEach(d => {
    pfList.push(d.data().parent);
  });
  toSnap.forEach(d => {
    ptList.push(d.data().parent);
  });
  mutualSnap.forEach(d => {
    pmList.push(d.data().parent);
  });
  pfList.forEach(prnt => {
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('from')
        .doc(ansDoc),
    );
    operationCounter++;
    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  ptList.forEach(prnt => {
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('to')
        .doc(ansDoc),
    );
    operationCounter++;
    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  pmList.forEach(prnt => {
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('mutual')
        .doc(ansDoc),
    );
    operationCounter++;
    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
  console.log('first half end');
  const path = `links/${ansDoc}`;
  const deleteFn = firebase.functions().httpsCallable('recursiveDelete');
  deleteFn({ path: path })
    .then(function(result) {
      console.log('Delete success: ' + JSON.stringify(result));
    })
    .catch(function(err) {
      console.log('Delete failed, see console,');
      console.warn(err);
    });
};

export const deleteAnswer = async (postDoc: string, ansDoc: string) => {
  const ans = db
    .collection('posts')
    .doc(postDoc)
    .collection('answers')
    .doc(ansDoc);
  await deleteAnsInLinks(ansDoc);
  await deleteComments(postDoc, ansDoc);
  await ans.delete();
  await rtdb.ref(ansDoc).remove();
};

export const asyncDeleteAns = (
  postDoc: string,
  ansDoc: string,
  uid: string,
  name: string,
) => {
  return async dispatch => {
    dispatch(startProfileLoad({}));
    await deleteAnsInLinks(ansDoc);
    await deleteAnsInUsers(ansDoc);
    const path = `posts/${postDoc}/answers/${ansDoc}`;
    const createAdminToken = func.httpsCallable('mintAdminToken');
    createAdminToken({ uid: uid })
      .then(res => {
        firebase
          .auth()
          .signInWithCustomToken(res.data as string)
          .then(rr => {
            const deleteFn = func.httpsCallable('recursiveDelete');
            deleteFn({ path: path })
              .then(function(result) {
                console.log('Delete success: ' + JSON.stringify(result));
                db.collectionGroup('answers')
                  .where('ansBy', '==', uid)
                  .get()
                  .then(snap => {
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
                        postBy: doc.data().postBy,
                        ansBy: doc.data().ansBy,
                        postAt: doc.data().postAt,
                        ansAt: doc.data().ansAt,
                        answer: name,
                      };
                      myanss.push(ans);
                    });
                    dispatch(getMyPins(myanss));
                    dispatch(endProfileLoad({}));
                  })
                  .catch(e => {
                    console.log(e);
                    dispatch(fetchError({}));
                  });
              })
              .catch(function(err) {
                console.log('Delete failed, see console,');
                console.warn(err);
              });
          })
          .catch(function(error) {
            console.log('error');
            console.log(error);
          });
      })
      .catch(err => {
        console.log('err in auth');
        console.log(err);
      });
  };
};

export const asyncDeletePost = (postDoc: string, uid: string) => {
  return async dispatch => {
    console.log('-------------------------------------');
    dispatch(startProfileLoad({}));
    // realtime db
    // rtdb.ref(postDoc).off('value');
    // await rtdb.ref(postDoc).remove();
    // get ansDocs
    const ansDocs = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .get();
    // delete anss
    ansDocs.forEach(async ad => {
      // realtime db
      rtdb.ref(ad.id).off('value');
      await rtdb.ref(ad.id).remove();
      // must have a parent ansDoc
      await deleteAnsInLinks(ad.id);
      // must have a parent uid
      await deleteAnsInUsers(ad.id);
    });
    // delete post
    // must have a parent uid
    await deletePostInUsers(postDoc);
    const path = `posts/${postDoc}`;
    const createAdminToken = func.httpsCallable('mintAdminToken');
    createAdminToken({ uid: uid })
      .then(res => {
        firebase
          .auth()
          .signInWithCustomToken(res.data as string)
          .then(rr => {
            const deleteFn = func.httpsCallable('recursiveDelete');
            deleteFn({ path: path })
              .then(function(result) {
                console.log('Delete success: ' + JSON.stringify(result));
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
                      const postAt = doc.data().postAt;
                      const uri = doc.data().uri;
                      posts.push({
                        postDoc: doc.id,
                        uri,
                        thms,
                        postBy,
                        width,
                        height,
                        postAt,
                      });

                      console.log('in foreach');
                      dispatch(getMyPosts(posts));
                    });
                    console.log('100% called');
                    if (posts.length === 0) {
                      dispatch(getMyPosts([]));
                    }
                    dispatch(endProfileLoad({}));
                  })
                  .catch(e => {
                    console.log(e);
                    dispatch(fetchError({}));
                  });
              })
              .catch(function(err) {
                console.log('Delete failed, see console,');
                console.warn(err);
              });
          })
          .catch(function(error) {
            console.log('error');
            console.log(error);
          });
      })
      .catch(err => {
        console.log('err in auth');
        console.log(err);
      });
  };
};
