import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Me } from './me';
import { Comb, Ans, Post, Comment, Nice } from '../types';
import { MyName } from './selector';

// 準備

const actionCreator = actionCreatorFactory('ME');

// Helper

async function getFromStorage(path: string) {
  const url = await storage.ref(path).getDownloadURL();

  return url;
}

const getAns = async (ansDoc: string) => {
  const ansData = await db
    .collection('anss')
    .doc(ansDoc)
    .get();
  const ans: Ans = {
    doc: ansData.id,
    postDoc: ansData.data().postDoc,
    orderThm: ansData.data().orderThm,
    ownerId: ansData.data().ownerId,
    fromLinks: ansData.data().fromLinks,
    toLinks: ansData.data().toLinks,
    comments: ansData.data().comments,
  };

  return ans;
};

const getComments = (docs: string[]) => {
  const comments: Comment[] = [];
  docs.forEach(async d => {
    const commentData = await db
      .collection('comments')
      .doc(d)
      .get();
    const comment: Comment = {
      doc: commentData.id,
      ansDoc: commentData.data().ansDoc,
      userName: commentData.data().userName,
      content: commentData.data().content,
      numGood: commentData.data().numGood,
    };
    comments.push(comment);
  });

  return comments;
};

// plain Actions

export const startFetch = actionCreator<{}>('START_FETCH');

export const endFetch = actionCreator<{}>('END_FETCH');

export const fetchError = actionCreator<{}>('FETCH_ERROR');

export const fetchImgError = actionCreator<{}>('FETCH_IMG_ERROR');

export const getMyInfo = actionCreator<{ userName: string; siBody: string }>(
  'GET_MY_INFO',
);

export const getIconUrl = actionCreator<{ iconUrl: string }>('GET_ICON_URL');

export const getMyCombs = actionCreator<Comb[]>('GET_MY_COMB');

export const getMyPosts = actionCreator<Post[]>('GET_MY_POST');

export const getMyNicePosts = actionCreator<Nice[]>('GET_MY_NICE_POST');

export const getMyGotitAnss = actionCreator<Comb[]>('GET_MY_GOTIT_ANS');

export const getMyLinkedAnss = actionCreator<Comb[]>('GET_MY_LINKED_ANS');

export const updateSiBody = actionCreator<{ siBody: string }>('UPDATE_SIBODY');

// async Actions

// drawerの各項目から呼ばれる

// 自分がいいねした投稿一覧

export const asyncGetMyNicePosts = (uid: string) => {
  return dispatch => {
    db.collection('users')
      .doc(uid)
      .collection('nices')
      .get()
      .then(snap => {
        const mynices: Nice[] = [];
        snap.forEach(doc => {
          const nice: Nice = {
            postDoc: doc.id,
            uri: doc.data().uri,
            by: doc.data().owner,
          };
          mynices.push(nice);
        });
        dispatch(getMyNicePosts(mynices));
      });
  };
};

// 自分が分かる！した回答一覧

export const asyncGetMyGotitAnss = (uid: string) => {
  // return dispatch => {
  //   db.collection('users')
  //     .doc(uid)
  //     .collection('gotits')
  //     .get()
  //     .then(snap => {
  //       const mygotits: Comb[] = [];
  //       snap.forEach(doc => {
  //         const gotit: Comb = {
  //           ansDoc: doc.id,
  //           postDoc: doc.data().postDoc,
  //           uri: doc.data().uri,
  //           thm: doc.data().thm,
  //           ans: doc.data().ans,
  //           postedBy: doc.data().postedBy,
  //           answeredBy: doc.data().answeredBy,
  //         };
  //         mygotits.push(gotit);
  //       });
  //       dispatch(getMyGotitAnss(mygotits));
  //     });
  // };
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

export const asyncGetMyCombs = (uid: string) => {
  return dispatch => {
    db.collectionGroup('answers')
      .where('ansBy', '==', uid)
      .get()
      .then(snap => {
        const myanss: Comb[] = [];
        snap.forEach(doc => {
          const ans: Comb = {
            postDoc: doc.data().postDoc,
            ansDoc: doc.data().ansDoc,
            uri: doc.data().uri,
            thms: doc.data().thms,
            orderThm: doc.data().orderThm,
            body: doc.data().body,
            postedBy: doc.data().postedBy,
            ansBy: doc.data().ansBy,
            postedAt: doc.data().postedAt,
            ansAt: doc.data().ansAt,
          };
          myanss.push(ans);
        });
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
        const userName = doc.data().un;
        const iconPath = doc.data().iconPath;
        const siBody = doc.data().sib;
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
