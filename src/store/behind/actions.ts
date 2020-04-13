import { actionCreatorFactory } from 'typescript-fsa';
import * as ImagePicker from 'expo-image-picker';
import firebase, { db, storage, rtdb } from '../../../firebase/firebase';
import {
  Ans,
  Post,
  Comment,
  Nice,
  PostedParams,
  NavigationParamList,
  DetailParams,
  Pin,
} from '../types';
import { database } from 'firebase';

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
  console.log(post);

  return post;
};

export const mutualCheck = async (myAnsDoc: string, ansDoc: string) => {
  const myFrom = db
    .collection('links')
    .doc(myAnsDoc)
    .collection('from')
    .doc(ansDoc);
  const myTo = db
    .collection('links')
    .doc(myAnsDoc)
    .collection('to')
    .doc(ansDoc);
  const myMutual = db
    .collection('links')
    .doc(myAnsDoc)
    .collection('mutual')
    .doc(ansDoc);

  return db.runTransaction(trn => {
    return trn.get(myTo).then(dt => {
      if (dt.exists) {
        trn.get(myFrom).then(df => {
          if (df.exists) {
            trn.update(myMutual, {
              postDoc: df.data().postDoc,
              uri: df.data().uri,
              thm: df.data().thm,
              body: df.data().body,
            });
          } else {
            trn.delete(myMutual);
          }
        });
      } else {
        trn.delete(myMutual);
      }
    });
  });
};

// plain Actions
export const fetching = actionCreator<{}>('FETCH');

export const error = actionCreator<{}>('ERROR');

export const done = actionCreator<{}>('DONE');

export const startFetch = actionCreator<{}>('START_FETCH');

export const getAnss = actionCreator<{
  anss1: Ans[];
  anss2: Ans[];
  anss3: Ans[];
}>('GET_ANS');

export const getMoreAnss1 = actionCreator<Ans[]>('GET_MORE_ANS1');
export const getMoreAnss2 = actionCreator<Ans[]>('GET_MORE_ANS2');
export const getMoreAnss3 = actionCreator<Ans[]>('GET_MORE_ANS3');

export const getParams = actionCreator<{
  postDoc: string;
  uri: string;
  width: number;
  height: number;
  owner: string;
  thms: string[];
  createdAt: firebase.firestore.Timestamp;
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

export const detailInit = actionCreator<DetailParams>('DETAIL_INIT');

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

export const asyncLink = (
  dparam: DetailParams,
  myansDoc: string,
  myansPostDoc: string,
  myansUri: string,
  myansThms: string[],
  myansThmOrder: number,
  myansBody: string,
) => {
  return async dispatch => {
    const linkAt = firebase.firestore.FieldValue.serverTimestamp();
    const fromansRef = db
      .collection('links')
      .doc(dparam.ansDoc)
      .collection('from')
      .doc(myansDoc);
    fromansRef.set({
      postDoc: myansPostDoc,
      ansDoc: myansDoc,
      uri: myansUri,
      thms: myansThms,
      order: myansThmOrder,
      body: myansBody,
      linkAt,
      parent: dparam.ansDoc,
    });
    const toansRef = db
      .collection('links')
      .doc(myansDoc)
      .collection('to')
      .doc(dparam.ansDoc);
    toansRef.set({
      postDoc: dparam.postDoc,
      ansDoc: dparam.ansDoc,
      uri: dparam.uri,
      thms: dparam.thms,
      order: dparam.order,
      body: dparam.body,
      linkAt,
      parent: myansDoc,
    });
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

export const asyncComment = (
  dparam: DetailParams,
  comment: string,
  uid: string,
) => {
  return async dispach => {
    const commentAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('posts')
      .doc(dparam.postDoc)
      .collection('answers')
      .doc(dparam.ansDoc)
      .collection('comments')
      .add({
        com: comment,
        comBy: uid,
        comAt: commentAt,
      })
      .then(() => {
        console.log('コメントした');
        asyncFetchComment(dparam.postDoc, dparam.ansDoc);
      })
      .catch(e => {
        console.log(e);
      });
  };
};

// 回答送信

export const asyncAnswer = (
  pparam: PostedParams,
  orderThm: number,
  body: string,
  ansBy: string,
) => {
  return async dispatch => {
    dispatch(fetching({}));
    const ansAt = firebase.firestore.FieldValue.serverTimestamp();
    const tate = pparam.height > pparam.width;

    db.collection('posts')
      .doc(pparam.postDoc)
      .collection('answers')
      .add({
        postDoc: pparam.postDoc,
        uri: pparam.uri,
        body,
        ansBy,
        ansAt,
        order: orderThm,
        w: pparam.width,
        h: pparam.height,
        tate,
        thms: pparam.thms,
        postBy: pparam.owner,
        postAt: pparam.createdAt,
      })
      .then(res => {
        const ansRef = rtdb.ref(res.id);
        ansRef.set({
          gCount: 0,
          gs: { test: null },
        });
        alert('回答しました！');
        dispatch(done({}));
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
    const isTate = height > width;
    db.collection('posts')
      .add({
        path: `${uid}/${dt}/${imageName}`,
        w: width,
        h: height,
        tate: isTate,
        postBy: uid,
        thms: thms,
        postAt: date,
      })
      .then(res => {
        const postRef = rtdb.ref(res.id);
        postRef.set({ nicesCount: 0, nices: { test: null } });
        const ref = storage.ref().child(`${uid}/${dt}/${imageName}`);
        ref.put(blob);

        alert('投稿完了しました!');
        dispatch(done({}));
      })
      .catch(error => {
        console.error('Error writing document: ', error);
        dispatch(error({}));
      });
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

export const asyncListenGotit = (ansDoc: string, uid: string) => {
  return disptch => {
    console.log('listener is called');
    rtdb.ref(ansDoc).on('value', snap => {
      const numGotit = snap.val().gCount;
      if (snap.val().gs) {
        console.log(snap.val().gs);
        const gotitByList = Object.keys(snap.val().gs);
        const isGotit = gotitByList.includes(uid);
        disptch(getGotit({ numGotit, gotitByList, isGotit }));
      } else {
        disptch(getGotit({ numGotit: 0, gotitByList: [], isGotit: false }));
      }
    });
  };
};

// 良いねのリスン

export const asyncListenNice = (postDoc: string, uid: string) => {
  return dispatch => {
    rtdb.ref(postDoc).on('value', snap => {
      const numNice = snap.val().nicesCount;
      if (snap.val().nices) {
        const niceByList = Object.keys(snap.val().nices);
        const isNiced = niceByList.includes(uid);
        dispatch(getNice({ numNice, niceByList, isNiced }));
      } else {
        dispatch(getNice({ numNice, niceByList: [], isNiced: false }));
      }
    });
  };
};

// わかる！を押した時

export const asyncGotit = (dparam: DetailParams, uid: string) => {
  return async dispatch => {
    const ansRef = rtdb.ref(dparam.ansDoc);
    ansRef.transaction(function(ans) {
      if (ans) {
        if (ans.gs && ans.gs[uid]) {
          ans.gCount--;
          ans.gs[uid] = null;
        } else {
          ans.gCount++;
          if (!ans.gs) {
            ans.gs = {};
          }
          ans.gs[uid] = true;
        }

        return ans;
      }
    });

    const gotitAt = firebase.firestore.FieldValue.serverTimestamp();
    const mygotit = db
      .collection('users')
      .doc(uid)
      .collection('gotits')
      .doc(dparam.ansDoc);

    return db
      .runTransaction(trn => {
        return trn.get(mygotit).then(mygotitDoc => {
          if (!mygotitDoc.exists) {
            trn.set(mygotit, {
              flag: true,
              postDoc: dparam.postDoc,
              uri: dparam.uri,
              thm: dparam.thms,
              order: dparam.order,
              body: dparam.body,
              ansBy: dparam.ansBy,
              gotitAt,
            });
          } else {
            if (mygotitDoc.data().flag) {
              trn.set(mygotit, { flag: false });
            } else {
              trn.update(mygotit, {
                flag: true,
                postDoc: dparam.postDoc,
                uri: dparam.uri,
                thm: dparam.thms,
                order: dparam.order,
                body: dparam.body,
                ansBy: dparam.ansBy,
                gotitAt,
              });
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
  postBy: string,
) => {
  return dispatch => {
    if (postDoc === undefined) return;
    const postRef = rtdb.ref(postDoc);
    postRef.transaction(function(post) {
      if (post) {
        if (post.nices && post.nices[uid]) {
          post.nicesCount--;
          post.nices[uid] = null;
        } else {
          post.nicesCount++;
          if (!post.nices) {
            post.nices = {};
          }
          post.nices[uid] = true;
        }
      }

      return post;
    });

    const niceAt = firebase.firestore.FieldValue.serverTimestamp();
    const mynice = db
      .collection('users')
      .doc(uid)
      .collection('nices')
      .doc(postDoc);

    return db
      .runTransaction(trn => {
        return trn.get(mynice).then(myniceDoc => {
          if (!myniceDoc.exists) {
            trn.set(mynice, {
              flag: true,
              uri,
              postBy,
              niceAt,
            });
          } else {
            if (myniceDoc.data().flag) {
              trn.set(mynice, { flag: false });
            } else {
              trn.update(mynice, {
                flag: true,
                uri,
                postBy,
                niceAt,
              });
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
          const ans: Ans = {
            ansDoc: doc.id,
            body: doc.data().body,
            ansBy: doc.data().ansBy,
            ansAt: doc.data().ansAt,
            orderThm: doc.data().orderThm,
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
      .where('orderThm', '==', 1)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const ans2 = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('orderThm', '==', 2)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const ans3 = await db
      .collection('posts')
      .doc(postDoc)
      .collection('answers')
      .where('orderThm', '==', 3)
      .orderBy('ansAt')
      .limit(10)
      .get();
    const anss1: Ans[] = [];
    const anss2: Ans[] = [];
    const anss3: Ans[] = [];
    ans1.forEach(doc => {
      const ans: Ans = {
        ansDoc: doc.id,
        body: doc.data().body,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        orderThm: doc.data().orderThm,
      };
      anss1.push(ans);
    });
    ans2.forEach(doc => {
      const ans: Ans = {
        ansDoc: doc.id,
        body: doc.data().body,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        orderThm: doc.data().orderThm,
      };
      anss2.push(ans);
    });
    ans3.forEach(doc => {
      const ans: Ans = {
        ansDoc: doc.id,
        body: doc.data().body,
        ansBy: doc.data().ansBy,
        ansAt: doc.data().ansAt,
        orderThm: doc.data().orderThm,
      };
      anss3.push(ans);
    });
    dispatch(getAnss({ anss1, anss2, anss3 }));
  };
};

// 与えられたansDocから各リンクを取得する

export const getLinks = actionCreator<{
  mpin: Pin[];
  fpin: Pin[];
  tpin: Pin[];
  links: Pin[];
}>('GET_LINKS');

export const asyncGetMoreLinks = (
  ansDoc: string,
  lastMutualPinAt: firebase.firestore.Timestamp,
  lastFromPinAt: firebase.firestore.Timestamp,
  lastToPinAt: firebase.firestore.Timestamp,
) => {
  return async dispatch => {
    const mutualList: Pin[] = [];
    const fromList: Pin[] = [];
    const toList: Pin[] = [];
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
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    from.forEach(snap => {
      console.log(snap.data());
      fromList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
        ansAt: snap.data().ansAt,
        linkAt: snap.data().linkAt,
      });
    });
    to.forEach(snap => {
      console.log(snap.data());
      toList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
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

export const asyncGetLinks = (ansDoc: string) => {
  return async dispatch => {
    const mutualList: Pin[] = [];
    const fromList: Pin[] = [];
    const toList: Pin[] = [];
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
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
        ansAt: snap.data().ansAt,
      });
    });
    from.forEach(snap => {
      fromList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
        ansAt: snap.data().ansAt,
      });
    });
    to.forEach(snap => {
      toList.push({
        ansDoc: snap.id,
        postDoc: snap.data().postDoc,
        uri: snap.data().uri,
        thms: snap.data().thms,
        order: snap.data().order,
        body: snap.data().body,
        postedAt: snap.data().postAt,
        ansAt: snap.data().ansAt,
      });
    });
    const links = mutualList.concat(fromList).concat(toList);
    dispatch(
      getLinks({ mpin: mutualList, fpin: fromList, tpin: toList, links }),
    );
  };
};
