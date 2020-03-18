import { actionCreatorFactory } from 'typescript-fsa';
import * as ImagePicker from 'expo-image-picker';
import firebase, { db, storage, rtdb } from '../../../firebase/firebase';
import {
  Comb,
  Ans,
  Post,
  Comment,
  Nice,
  PostedParams,
  NavigationParamList,
  DetailParams,
} from '../types';

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

const mutualCheck = async (fromAnsDoc: string, toAnsDoc: string) => {
  const fromRef = rtdb.ref(fromAnsDoc);
  const toRef = rtdb.ref(toAnsDoc);
  let c1 = false;
  let c2 = false;
  fromRef.transaction(function(from) {
    console.log(from);
    if (from.from[toAnsDoc]) {
      from.mutual[toAnsDoc] = from.from[toAnsDoc];
      c1 = true;
    }
  });
  toRef.transaction(function(to) {
    console.log(to);
    if (to.to[fromAnsDoc]) {
      to.mutual[fromAnsDoc] = to.to[fromAnsDoc];
      c2 = true;
    }
  });
  if (c1 && c2) {
    return true;
  } else if (c1 || c2) {
    console.log('おかしい');
  } else {
    return false;
  }
};

const mutualCheck2 = async (
  dparam: DetailParams,
  myansDoc: string,
  myansPostDoc: string,
  myansUri: string,
  myansThm: string,
  myansBody: string,
) => {
  const fromRef = rtdb.ref(myansDoc);
  const toRef = rtdb.ref(dparam.ansDoc);
  let c1 = false;
  let c2 = false;
  fromRef.transaction(function(frommm) {
    console.log(frommm.from[dparam.ansDoc]);
    if (frommm.from[dparam.ansDoc]) {
      c1 = true;
    }
  });
  toRef.transaction(function(tooo) {
    console.log(tooo.to[myansDoc]);
    if (tooo.to[myansDoc]) {
      c2 = true;
    }
  });
  if (c1 && c2) {
    console.log('相互');
    const refFrom = rtdb.ref(myansDoc + '/mutual/' + dparam.ansDoc);
    refFrom.set({
      postDoc: dparam.postDoc,
      uri: dparam.uri,
      thm: dparam.thm,
      body: dparam.body,
    });
    const refTo = rtdb.ref(dparam.ansDoc + '/mutual/' + myansDoc);
    refTo.set({
      postDoc: myansPostDoc,
      uri: myansUri,
      thm: myansThm,
      body: myansBody,
    });

    return true;
  } else if (c1 || c2) {
    console.log('おかしい');
  } else {
    return false;
  }
};

// plain Actions

export const startFetch = actionCreator<{}>('START_FETCH');

export const getAnss = actionCreator<Ans[]>('GET_ANS');

export const getParams = actionCreator<{
  postDoc: string;
  uri: string;
  width: number;
  height: number;
  owner: string;
  thms: string[];
  createdAt: Date;
}>('GET_PARAMS');

export const getNice = actionCreator<{ numNice: number; niceByList: string[] }>(
  'GET_NICE',
);

export const getGotit = actionCreator<{
  numGotit: number;
  gotitByList: string[];
}>('GET_GOTIT');

export const detailInit = actionCreator<DetailParams>('DETAIL_INIT');

export const add2nd = actionCreator<{}>('ADD_2ND');
export const add3rd = actionCreator<{}>('ADD_3RD');
export const remove2nd = actionCreator<{}>('REMOVE_2ND');
export const remove3rd = actionCreator<{}>('REMOVE_3RD');

export const setImage = actionCreator<{
  uri: string;
  filename: string;
  width: number;
  height: number;
}>('SET_IMG');

export const getComments = actionCreator<Comment[]>('GET_COMMENTS');

// Async Actions

// リンクする

export const asyncLink = (
  dparam: DetailParams,
  myansDoc: string,
  myansPostDoc: string,
  myansUri: string,
  myansThm: string,
  myansBody: string,
) => {
  return async dispatch => {
    const toansRef = rtdb.ref(dparam.ansDoc + '/from/' + myansDoc);
    toansRef.set({
      postDoc: myansPostDoc,
      uri: myansUri,
      thm: myansThm,
      body: myansBody,
    });
    const fromansRef = rtdb.ref(myansDoc + '/to/' + dparam.ansDoc);
    fromansRef.set({
      postDoc: dparam.postDoc,
      uri: dparam.uri,
      thm: dparam.thm,
      body: dparam.body,
    });
    mutualCheck2(dparam, myansDoc, myansPostDoc, myansUri, myansThm, myansBody);
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
        orderThm,
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
          gs: {
            userid: 'まだいません',
          },
          mutual: {
            ansDoc: 'まだありません',
          },
          from: {
            ansDoc: 'まだありません',
          },
          to: {
            ansDoc: 'まだありません',
          },
        });
        alert('回答しました！');
      });
  };
};

// 画像のアップロード
export const asyncUploadImage = (
  uid: string,
  uri: string,
  width: number,
  height: number,
  imageName: string,
  thm1: string,
  thm2: string,
  thm3: string,
  add2nd: boolean,
  add3rd: boolean,
) => {
  return async dispatch => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const d = new Date();
    const dt = d.toString().substr(4, 20);
    const date = firebase.firestore.FieldValue.serverTimestamp();
    const thms = [];
    if (add2nd && add3rd) {
      thms.push(thm1);
      thms.push(thm2);
      thms.push(thm3);
    } else if (add2nd) {
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
        console.log(res.id);
        const postRef = rtdb.ref(res.id);
        postRef.set({ nicesCount: 0, nices: { test: true } });

        alert('投稿完了しました!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
    const ref = storage.ref().child(`${uid}/${dt}/${imageName}`);

    return ref.put(blob);
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

export const asyncListenGotit = (ansDoc: string) => {
  return disptch => {
    console.log('called');
    rtdb.ref(ansDoc).on('value', snap => {
      const numGotit = snap.val().gCount;
      if (snap.val().gs) {
        console.log(snap.val().gs);
        const gotitByList = Object.keys(snap.val().gs);
        disptch(getGotit({ numGotit, gotitByList }));
      } else {
        disptch(getGotit({ numGotit: 0, gotitByList: [] }));
      }
    });
  };
};

// 良いねのリスン

export const asyncListenNice = (postDoc: string) => {
  return dispatch => {
    rtdb.ref(postDoc).on('value', snap => {
      const numNice = snap.val().nicesCount;
      if (snap.val().nices) {
        const niceByList = Object.keys(snap.val().nices);
        dispatch(getNice({ numNice, niceByList }));
      } else {
        dispatch(getNice({ numNice, niceByList: [] }));
      }
    });
  };
};

// わかる！を押した時

export const asyncGotit = (dparam: DetailParams, uid: string) => {
  return dispatch => {
    const ansRef = rtdb.ref(dparam.ansDoc);
    const myGotitRef = rtdb.ref(uid + '/gotits');
    myGotitRef.transaction(function(gotitanss) {
      if (gotitanss) {
        if (gotitanss[dparam.ansDoc]) {
          gotitanss[dparam.ansDoc] = null;
        } else {
          gotitanss[dparam.ansDoc] = {
            postDoc: dparam.postDoc,
            uri: dparam.uri,
            thm: dparam.thm,
            body: dparam.body,
            ansBy: dparam.ansBy,
          };
        }
      }

      return gotitanss;
    });

    ansRef.transaction(function(ans) {
      console.log('ans');
      console.log(ans);
      if (ans) {
        if (ans.gs && ans.gs[uid]) {
          ans.gCount--;
          ans.gs[uid] = null;
        } else {
          ans.gCount++;
          ans.gs[uid] = true;
        }

        return ans;
      }
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
    const myNicesRef = rtdb.ref(uid + '/nices');
    myNicesRef.transaction(function(niceposts) {
      if (niceposts) {
        if (niceposts[postDoc]) {
          niceposts[postDoc] = null;
        } else {
          niceposts[postDoc] = {
            uri,
            postBy,
          };
        }
      }

      return niceposts;
    });

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
  };
};

// 与えられたpostDocからanssを取得する

export const asyncGetAnss = (postDoc: string) => {
  return dispatch => {
    if (postDoc === undefined) return;
    dispatch(startFetch({}));
    db.collection('posts')
      .doc(postDoc)
      .collection('answers')
      .get()
      .then(snap => {
        const anss: Ans[] = [];
        snap.forEach(doc => {
          const ans: Ans = {
            ansDoc: doc.id,
            body: doc.data().body,
            ansBy: doc.data().ansBy,
            ansAt: doc.data().ansAt.toDate(),
            orderThm: doc.data().orderThm,
          };
          anss.push(ans);
        });
        dispatch(getAnss(anss));
      });
  };
};
