import { actionCreatorFactory } from 'typescript-fsa';
import * as ImagePicker from 'expo-image-picker';
import firebase, { db, storage, rtdb } from '../../../firebase/firebase';
import {
  Post,
  Comment,
  NavigationParamList,
  Pin,
  LinkPin,
  GotitPin,
  NicePost,
} from '../types';
import { database } from 'firebase';
import { asyncGetName } from '../../helper';
import { refetch } from '../timeLine/actions';

// 準備

const actionCreator = actionCreatorFactory('BEHIND');

// Helper

const toggleNice = (postRef, uid) => {
  const post = postRef.transaction(function(post) {
    if (post) {
      if (post.nices && post.nices[uid]) {
        post.nicesCount--;
        post.nices[uid] = null;
      } else {
        post.nicesCount++;
        if (!post.nices) {
          post.nices = { example: true };
        }
        post.nices[uid] = true;
      }
    }

    return post;
  });
  // console.log(post);

  return post;
};

// export const mutualCheckOld = async (myAnsDoc: string, ansDoc: string) => {
//   const myFrom = db
//     .collection('links')
//     .doc(myAnsDoc)
//     .collection('from')
//     .doc(ansDoc);
//   const myTo = db
//     .collection('links')
//     .doc(myAnsDoc)
//     .collection('to')
//     .doc(ansDoc);
//   const myMutual = db
//     .collection('links')
//     .doc(myAnsDoc)
//     .collection('mutual')
//     .doc(ansDoc);

//   return db.runTransaction(trn => {
//     return trn.get(myTo).then(dt => {
//       if (dt.exists) {
//         trn.get(myFrom).then(df => {
//           if (df.exists) {
//             trn.update(myMutual, {
//               postDoc: df.data().postDoc,
//               uri: df.data().uri,
//               thm: df.data().thm,
//               body: df.data().body,
//             });
//           } else {
//             trn.delete(myMutual);
//           }
//         });
//       } else {
//         trn.delete(myMutual);
//       }
//     });
//   });
// };

// plain Actions
export const fetching = actionCreator<{}>('FETCH');

export const error = actionCreator<{}>('ERROR');

export const done = actionCreator<{}>('DONE');

export const postExist = actionCreator<{ postExist: boolean }>('POST_EXIST');
export const ansExist = actionCreator<{ ansExist: boolean }>('ANS_EXIST');

export const startFetch = actionCreator<{}>('START_FETCH');

export const getAnss = actionCreator<{
  anss1: Pin[];
  anss2: Pin[];
  anss3: Pin[];
}>('GET_ANS');

export const getMoreAnss1 = actionCreator<Pin[]>('GET_MORE_ANS1');
export const getMoreAnss2 = actionCreator<Pin[]>('GET_MORE_ANS2');
export const getMoreAnss3 = actionCreator<Pin[]>('GET_MORE_ANS3');

export const getParams = actionCreator<{
  postDoc: string;
  uri: string;
  width: number;
  height: number;
  postBy: string;
  thms: string[];
  postAt: firebase.firestore.Timestamp;
}>('GET_PARAMS');

export const getNice = actionCreator<{
  numNice: number;
  niceByList: string[];
  isNiced: boolean;
}>('GET_NICE');

export const getGotit = actionCreator<{
  numGotit: number;
  gotitByList: string[];
  isGotit: boolean;
}>('GET_GOTIT');

export const detailInit = actionCreator<Pin>('DETAIL_INIT');

export const ansInit = actionCreator<{}>('ANS_INIT');
export const postInit = actionCreator<{}>('POST_INIT');

export const setImage = actionCreator<{
  uri: string;
  filename: string;
  width: number;
  height: number;
}>('SET_IMG');

export const getComments = actionCreator<Comment[]>('GET_COMMENTS');

// Async Actions

// リンク解除

export const asyncDelink = (myAnsDoc: string, toAnsDoc: string) => {
  return async dispatch => {
    const myRef = db
      .collection('links')
      .doc(myAnsDoc)
      .collection('to')
      .doc(toAnsDoc);
    const toRef = db
      .collection('links')
      .doc(toAnsDoc)
      .collection('from')
      .doc(myAnsDoc);
    await myRef.delete();
    await toRef.delete();
    alert('リンク解除しました。');
  };
};

// リンクする

const mutualCheck = async (fromAnsDoc: string, toAnsDoc: string) => {
  const fromM = db
    .collection('links')
    .doc(fromAnsDoc)
    .collection('from')
    .doc(toAnsDoc);

  const data = await fromM.get();
  console.log('data.exists');
  console.log(data.exists);
  if (!data.exists) {
    return false;
  } else {
    return true;
  }
};

export const asyncLink = (
  dparam: Pin,
  myansDoc: string,
  myansPostDoc: string,
  myansUri: string,
  myansThms: string[],
  myansThmOrder: number,
  myansBody: string,
  myansPostAt: firebase.firestore.Timestamp,
  myansPostBy: string,
  myansAnsAt: firebase.firestore.Timestamp,
  myansAnsBy: string,
) => {
  return async dispatch => {
    const linkAt = firebase.firestore.FieldValue.serverTimestamp();
    const fromansRef = db
      .collection('links')
      .doc(dparam.ansDoc)
      .collection('from')
      .doc(myansDoc);
    const toansRef = db
      .collection('links')
      .doc(myansDoc)
      .collection('to')
      .doc(dparam.ansDoc);
    const data = await fromansRef.get();
    if (data.exists) {
      alert('すでにリンクしています！');

      return;
    }
    await db
      .collection('users')
      .doc(dparam.ansBy)
      .collection('notes')
      .add({
        cases: 'LINKED',
        message: 'リンクされました！',
        opeBy: myansAnsBy,
        postDoc: myansPostDoc,
        ansDoc: myansDoc,
        uri: myansUri,
        thms: myansThms,
        order: myansThmOrder,
        body: myansBody,
        postBy: myansPostBy,
        postAt: myansPostAt,
        ansBy: myansAnsBy,
        ansAt: myansAnsAt,
      });

    await fromansRef.set({
      postDoc: myansPostDoc,
      ansDoc: myansDoc,
      uri: myansUri,
      thms: myansThms,
      order: myansThmOrder,
      body: myansBody,
      postBy: myansPostBy,
      postAt: myansPostAt,
      ansAt: myansAnsAt,
      ansBy: myansAnsBy,
      linkAt,
      parent: dparam.ansDoc,
    });
    await toansRef.set({
      postDoc: dparam.postDoc,
      ansDoc: dparam.ansDoc,
      uri: dparam.uri,
      thms: dparam.thms,
      order: dparam.order,
      body: dparam.body,
      postAt: dparam.postAt,
      postBy: dparam.postBy,
      ansAt: dparam.ansAt,
      ansBy: dparam.ansBy,
      linkAt,
      parent: myansDoc,
    });
    alert('リンクしました！');
    const mutual = await mutualCheck(myansDoc, dparam.ansDoc);
    if (mutual) {
      console.log('mutual');
      const fromM = db
        .collection('links')
        .doc(myansDoc)
        .collection('mutual')
        .doc(dparam.ansDoc);
      const toM = db
        .collection('links')
        .doc(dparam.ansDoc)
        .collection('mutual')
        .doc(myansDoc);
      await fromM.set({
        postDoc: dparam.postDoc,
        ansDoc: dparam.ansDoc,
        uri: dparam.uri,
        thms: dparam.thms,
        order: dparam.order,
        body: dparam.body,
        ansAt: dparam.ansAt,
        linkAt,
        parent: myansDoc,
      });
      await toM.set({
        postDoc: myansPostDoc,
        ansDoc: myansDoc,
        uri: myansUri,
        thms: myansThms,
        order: myansThmOrder,
        body: myansBody,
        ansAt: myansAnsAt,
        linkAt,
        parent: dparam.ansDoc,
      });
      alert('相互リンクになりました！');
    }
  };
};

// コメントフェッチ（テーマごと）

export const asyncFetchComment = (postDoc: string, ansDoc: string) => {
  return async dispatch => {
    db.collection('posts')
      .doc(postDoc)
      .collection('answers')
      .doc(ansDoc)
      .collection('comments')
      .get()
      .then(snap => {
        const comList = [];
        snap.forEach(comDoc => {
          const com = comDoc.data().com;
          const comBy = comDoc.data().comBy;
          const comAt = comDoc.data().comAt;
          comList.push({ comDoc: comDoc.id, com, comBy, comAt });
        });
        // todo
        dispatch(getComments(comList));
      });
  };
};

// コメント送信

export const asyncComment = (dparam: Pin, comment: string, uid: string) => {
  return async dispach => {
    const commentAt = firebase.firestore.FieldValue.serverTimestamp();

    await db
      .collection('users')
      .doc(dparam.ansBy)
      .collection('notes')
      .add({
        cases: 'COMMENTED',
        message: 'コメントがつきました！',
        opeBy: uid,
        postDoc: dparam.postDoc,
        ansDoc: dparam.ansDoc,
        uri: dparam.uri,
        width: dparam.width,
        height: dparam.height,
        thms: dparam.thms,
        order: dparam.order,
        body: dparam.body,
        postBy: dparam.postBy,
        postAt: dparam.postAt,
        ansBy: dparam.ansBy,
        ansAt: dparam.ansAt,
      });

    db.collection('posts')
      .doc(dparam.postDoc)
      .collection('answers')
      .doc(dparam.ansDoc)
      .collection('comments')
      .add({
        postDoc: dparam.postDoc,
        ansDoc: dparam.ansDoc,
        uri: dparam.uri,
        width: dparam.width,
        height: dparam.height,
        thms: dparam.thms,
        order: dparam.order,
        body: dparam.body,
        postBy: dparam.postBy,
        postAt: dparam.postAt,
        ansBy: dparam.ansBy,
        ansAt: dparam.ansAt,
        com: comment,
        comBy: uid,
        comAt: commentAt,
      })
      .then(() => {
        console.log('コメントした');
        // asyncFetchComment(dparam.postDoc, dparam.ansDoc);
      })
      .catch(e => {
        console.log(e);
      });
  };
};

// 回答送信

export const asyncAnswer = (
  pparam: Post,
  order: number,
  body: string,
  ansBy: string,
) => {
  return async dispatch => {
    dispatch(ansInit({}));
    const ansAt = firebase.firestore.FieldValue.serverTimestamp();

    db.collection('posts')
      .doc(pparam.postDoc)
      .collection('answers')
      .add({
        postDoc: pparam.postDoc,
        uri: pparam.uri,
        body,
        ansBy,
        ansAt,
        order,
        width: pparam.width,
        height: pparam.height,
        thms: pparam.thms,
        postBy: pparam.postBy,
        postAt: pparam.postAt,
        gc: 0,
        gbl: [],
      })
      .then(res => {
        // 通知用
        db.collection('users')
          .doc(pparam.postBy)
          .collection('notes')
          .add({
            cases: 'ANSWERED',
            message: '回答されました！',
            opeBy: ansBy,
            postDoc: pparam.postDoc,
            ansDoc: res.id,
            uri: pparam.uri,
            body,
            ansBy,
            ansAt,
            order,
            width: pparam.width,
            height: pparam.height,
            thms: pparam.thms,
            postBy: pparam.postBy,
            postAt: pparam.postAt,
          })
          .then(r => {
            alert('回答しました！');
            dispatch(done({}));
          });
      })
      .catch(e => {
        console.log(e);
        dispatch(error({}));
      });
  };
};

// 画像のアップロード
export const asyncPost = (
  uid: string,
  uri: string,
  width: number,
  height: number,
  imageName: string,
  thm1: string,
  thm2: string,
  thm3: string,
  numThm: number,
) => {
  return async dispatch => {
    dispatch(fetching({}));
    const response = await fetch(uri);
    const blob = await response.blob();
    const d = new Date();
    const dt = d.toString().substr(4, 20);
    const date = firebase.firestore.FieldValue.serverTimestamp();
    const thms = [];
    if (numThm === 3) {
      thms.push(thm1);
      thms.push(thm2);
      thms.push(thm3);
    } else if (numThm === 2) {
      thms.push(thm1);
      thms.push(thm2);
    } else {
      thms.push(thm1);
    }

    // Create the file metadata
    const metadata = {
      cacheControl: 'public,max-age=300',
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const uploadTask = storage
      .ref()
      .child(`${uid}/${dt}/${imageName}`)
      .put(blob, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function(error) {
        console.log(error);
        alert(error);
      },
      function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          db.collection('posts')
            .add({
              // path: `${uid}/${dt}/${imageName}`,
              uri: downloadURL,
              width,
              height,
              postBy: uid,
              thms,
              postAt: date,
              nc: 0,
              nbl: [],
            })
            .then(res => {
              // const postRef = rtdb.ref(res.id);
              // postRef.set({ nicesCount: 0, nices: { test: null } });

              alert('投稿完了しました!');
              dispatch(done({}));
              dispatch(refetch({}));
            })
            .catch(error => {
              console.error('Error writing document: ', error);
              dispatch(error({}));
            });
        });
      },
    );
  };
};

// 画像の選択

export const asyncChooseImage = () => {
  return dispatch => {
    ImagePicker.launchImageLibraryAsync().then(res => {
      if (!res.cancelled) {
        const uriList = res.uri.split('/');
        const filename = uriList.pop();

        dispatch(
          setImage({
            uri: res.uri,
            filename,
            width: res.width,
            height: res.height,
          }),
        );
      }
    });
  };
};

// わかる！のリスン

// export const asyncListenGotit = (ansDoc: string, uid: string) => {
//   return disptch => {
//     console.log('listener is called');
//     rtdb.ref(ansDoc).on('value', snap => {
//       if (snap.exists) {
//         const numGotit = snap.val().gCount;
//         if (snap.val().gs) {
//           // console.log(snap.val().gs);
//           const gotitByList = Object.keys(snap.val().gs);
//           const isGotit = gotitByList.includes(uid);
//           disptch(getGotit({ numGotit, gotitByList, isGotit }));
//         } else {
//           disptch(getGotit({ numGotit: 0, gotitByList: [], isGotit: false }));
//         }
//       }
//     });
//   };
// };

// 良いねのリスン

// export const asyncListenNice = (postDoc: string, uid: string) => {
//   return dispatch => {
//     rtdb.ref(postDoc).on('value', snap => {
//       if (snap.exists) {
//         const numNice = snap.val().nicesCount;
//         if (snap.val().nices) {
//           const niceByList = Object.keys(snap.val().nices);
//           const isNiced = niceByList.includes(uid);
//           dispatch(getNice({ numNice, niceByList, isNiced }));
//         } else {
//           dispatch(getNice({ numNice, niceByList: [], isNiced: false }));
//         }
//       }
//     });
//   };
// };

// わかる！を押した時

export const asyncGotit = (dparam: Pin, uid: string) => {
  return async dispatch => {
    const gotitAt = firebase.firestore.FieldValue.serverTimestamp();
    const target = db
      .collection('posts')
      .doc(dparam.postDoc)
      .collection('answers')
      .doc(dparam.ansDoc);
    const mygotit = db
      .collection('users')
      .doc(uid)
      .collection('gotits')
      .doc(dparam.ansDoc);
    const obj = {
      parent: uid,
      postDoc: dparam.postDoc,
      ansDoc: dparam.ansDoc,
      uri: dparam.uri,
      width: dparam.width,
      height: dparam.height,
      thms: dparam.thms,
      order: dparam.order,
      body: dparam.body,
      postBy: dparam.postBy,
      postAt: dparam.postAt,
      ansBy: dparam.ansBy,
      ansAt: dparam.ansAt,
      flag: true,
      gotitBy: uid,
      gotitAt,
    };

    db.runTransaction(trn => {
      return trn.get(target).then(anssnap => {
        const cl = anssnap.data().gbl;
        if (cl.includes(uid)) {
          const nl = cl.filter(u => u !== uid);
          trn.update(target, { gc: nl.length, gbl: nl });
        } else {
          cl.push(uid);
          trn.update(target, { gc: cl.length, gbl: cl });
        }
      });
    });

    return db
      .runTransaction(trn => {
        return trn.get(mygotit).then(mygotitDoc => {
          if (!mygotitDoc.exists) {
            trn.set(mygotit, obj);
          } else {
            if (mygotitDoc.data().flag) {
              trn.set(mygotit, { flag: false });
            } else {
              trn.update(mygotit, obj);
            }
          }
        });
      })
      .catch(function(error) {
        console.log('Gotit Transaction failed: ', error);
      });
  };
};

// 良いねを押した時

export const asyncNice = (
  postDoc: string,
  uid: string,
  uri: string,
  width: number,
  height: number,
  thms: string[],
  postBy: string,
  postAt: firebase.firestore.Timestamp,
) => {
  return dispatch => {
    if (postDoc === undefined) return;
    // const postRef = rtdb.ref(postDoc);
    // postRef.transaction(function(post) {
    //   if (post) {
    //     if (post.nices && post.nices[uid]) {
    //       post.nicesCount--;
    //       post.nices[uid] = null;
    //     } else {
    //       post.nicesCount++;
    //       if (!post.nices) {
    //         post.nices = {};
    //       }
    //       post.nices[uid] = true;
    //     }
    //   }

    //   return post;
    // });

    const niceAt = firebase.firestore.FieldValue.serverTimestamp();
    const target = db.collection('posts').doc(postDoc);
    const mynice = db
      .collection('users')
      .doc(uid)
      .collection('nices')
      .doc(postDoc);
    const obj = {
      parent: uid,
      flag: true,
      postDoc,
      uri,
      width,
      height,
      thms,
      postBy,
      postAt,
      niceBy: uid,
      niceAt,
    };

    db.runTransaction(trn => {
      return trn.get(target).then(postsnap => {
        const cl = postsnap.data().nbl;
        if (cl.includes(uid)) {
          const nl = cl.filter(u => u !== uid);
          trn.update(target, { nc: nl.length, nbl: nl });
        } else {
          cl.push(uid);
          trn.update(target, { nc: cl.length, nbl: cl });
        }
      });
    });

    return db
      .runTransaction(trn => {
        return trn.get(mynice).then(myniceDoc => {
          if (!myniceDoc.exists) {
            trn.set(mynice, obj);
          } else {
            if (myniceDoc.data().flag) {
              trn.set(mynice, { flag: false });
            } else {
              trn.update(mynice, obj);
            }
          }
        });
      })
      .catch(function(error) {
        console.log('Nice Transaction failed: ', error);
      });
  };
};

// 答えの追加フェッチ

export const asyncGetMoreAnss = (
  postDoc: string,
  orderThm: number,
  lastAnsAt: firebase.firestore.Timestamp,
) => {
  return dispatch => {
    dispatch(startFetch({}));
    db.collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('orderThm', '==', orderThm)
      .orderBy('ansAt')
      .limit(10)
      .startAfter(lastAnsAt)
      .get()
      .then(snap => {
        const additional = [];
        snap.forEach(doc => {
          const ans: Pin = {
            ansDoc: doc.id,
            postDoc: doc.data().postDoc,
            uri: doc.data().uri,
            width: doc.data().width,
            height: doc.data().height,
            thms: doc.data().thms,
            order: doc.data().order,
            body: doc.data().body,
            postBy: doc.data().postBy,
            postAt: doc.data().postAt,
            ansBy: doc.data().ansBy,
            ansAt: doc.data().ansAt,
          };
          additional.push(ans);
        });
        if (orderThm === 1) {
          dispatch(getMoreAnss1(additional));
        } else if (orderThm === 2) {
          dispatch(getMoreAnss2(additional));
        } else {
          dispatch(getMoreAnss3(additional));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

// 与えられたpostDocからanssを取得する

export const asyncGetAnss = (postDoc: string) => {
  return async dispatch => {
    if (postDoc === undefined) return;
    dispatch(startFetch({}));
    const ans1 = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('order', '==', 1)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const ans2 = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('order', '==', 2)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const ans3 = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('order', '==', 3)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const anss1: Pin[] = [];
    const anss2: Pin[] = [];
    const anss3: Pin[] = [];
    ans1.forEach(async doc => {
      const answer = await asyncGetName(doc.data().ansBy);
      const ans: Pin = {
        ansDoc: doc.id,
        postDoc: doc.data().postDoc,
        uri: doc.data().uri,
        width: doc.data().width,
        height: doc.data().height,
        thms: doc.data().thms,
        order: doc.data().order,
        body: doc.data().body,
        postBy: doc.data().postBy,
        postAt: doc.data().postAt,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        answer: answer,
      };
      anss1.push(ans);
    });
    ans2.forEach(async doc => {
      const answer = await asyncGetName(doc.data().ansBy);
      const ans: Pin = {
        ansDoc: doc.id,
        postDoc: doc.data().postDoc,
        uri: doc.data().uri,
        width: doc.data().width,
        height: doc.data().height,
        thms: doc.data().thms,
        order: doc.data().order,
        body: doc.data().body,
        postBy: doc.data().postBy,
        postAt: doc.data().postAt,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        answer: answer,
      };
      anss2.push(ans);
    });
    ans3.forEach(async doc => {
      const answer = await asyncGetName(doc.data().ansBy);
      const ans: Pin = {
        ansDoc: doc.id,
        postDoc: doc.data().postDoc,
        uri: doc.data().uri,
        width: doc.data().width,
        height: doc.data().height,
        thms: doc.data().thms,
        order: doc.data().order,
        body: doc.data().body,
        postBy: doc.data().postBy,
        postAt: doc.data().postAt,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        answer: answer,
      };
      anss3.push(ans);
    });
    dispatch(getAnss({ anss1, anss2, anss3 }));
  };
};

// 与えられたansDocから各リンクを取得する

export const getLinks = actionCreator<{
  mpin: LinkPin[];
  fpin: LinkPin[];
  tpin: LinkPin[];
  links: LinkPin[];
}>('GET_LINKS');

export const asyncGetMoreLinks = (
  ansDoc: string,
  lastMutualPinAt: firebase.firestore.Timestamp,
  lastFromPinAt: firebase.firestore.Timestamp,
  lastToPinAt: firebase.firestore.Timestamp,
) => {
  return async dispatch => {
    const mutualList: LinkPin[] = [];
    const fromList: LinkPin[] = [];
    const toList: LinkPin[] = [];
    dispatch(startFetch({}));
    const base = db.collection('links').doc(ansDoc);
    const mutual = await base
      .collection('mutual')
      .orderBy('linkAt')
      .limit(10)
      .startAfter(lastMutualPinAt)
      .get();
    const from = await base
      .collection('from')
      .orderBy('linkAt')
      .limit(10)
      .startAfter(lastFromPinAt)
      .get();
    const to = await base
      .collection('to')
      .orderBy('linkAt')
      .limit(10)
      .startAfter(lastToPinAt)
      .get();

    mutual.forEach(snap => {
      mutualList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    from.forEach(snap => {
      // console.log(snap.data());
      fromList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    to.forEach(snap => {
      // console.log(snap.data());
      toList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    const links = mutualList.concat(fromList).concat(toList);
    console.log('ここまでOK');
    dispatch(
      getLinks({ mpin: mutualList, fpin: fromList, tpin: toList, links }),
    );
  };
};

export const asyncGetLinks = (ansDoc: string) => {
  return async dispatch => {
    const mutualList: LinkPin[] = [];
    const fromList: LinkPin[] = [];
    const toList: LinkPin[] = [];
    dispatch(startFetch({}));
    const base = db.collection('links').doc(ansDoc);
    const mutual = await base.collection('mutual').get();
    const from = await base.collection('from').get();
    const to = await base.collection('to').get();

    mutual.forEach(snap => {
      mutualList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    from.forEach(snap => {
      fromList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    to.forEach(snap => {
      toList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        width: snap.data().width,
        height: snap.data().height,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postBy: snap.data().postBy,
        postAt: snap.data().postAt,
        ansBy: snap.data().ansBy,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    const links = mutualList.concat(fromList).concat(toList);
    dispatch(
      getLinks({ mpin: mutualList, fpin: fromList, tpin: toList, links }),
    );
  };
};

// いいねのリスン

export const listenNices = (postDoc: string, uid: string) => {
  return async dispatch => {
    db.collection('posts')
      .doc(postDoc)
      .onSnapshot(snap => {
        const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
        console.log('listened change at ' + source);
        if (snap.exists) {
          const numNice = snap.data().nc;
          const niceByList = snap.data().nbl;
          const isNiced = niceByList.includes(uid);
          dispatch(getNice({ numNice, niceByList, isNiced }));
        }
      });
  };
};

// 分かるのリスン

export const listenGotits = (postDoc: string, ansDoc: string, uid: string) => {
  return async dispatch => {
    db.collection('posts')
      .doc(postDoc)
      .collection('answers')
      .doc(ansDoc)
      .onSnapshot(snap => {
        const source = snap.metadata.hasPendingWrites ? 'Local' : 'Server';
        console.log('listened change at ' + source);
        if (snap.exists) {
          const numGotit = snap.data().gc;
          const gotitByList = snap.data().gbl;
          const isGotit = gotitByList.includes(uid);
          dispatch(getGotit({ numGotit, gotitByList, isGotit }));
        }
      });
  };
};

// 存在のリスン

export const listenPost = (postDoc: string) => {
  return dispatch => {
    db.collection('posts')
      .doc(postDoc)
      .onSnapshot(snap => {
        if (snap.exists) {
          dispatch(postExist({ postExist: true }));
        } else {
          dispatch(postExist({ postExist: false }));
        }
      });
  };
};

export const listenAns = (postDoc: string, ansDoc: string) => {
  return dispatch => {
    console.log('ここまでーー');
    db.collection('posts')
      .doc(postDoc)
      .collection('answers')
      .doc(ansDoc)
      .onSnapshot(snap => {
        if (snap.exists) {
          console.log('ここまでーー２');
          dispatch(ansExist({ ansExist: true }));
        } else {
          dispatch(ansExist({ ansExist: false }));
        }
      });
  };
};
