import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Me } from './me';
import { Comb, Ans, Post, Comment, Nice } from '../types';

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

const getLinkCombs = (docs: string[]) => {
  const combs: Comb[] = [];
  docs.forEach(async d => {
    const combData = await db
      .collection('combs')
      .doc(d)
      .get();
    const comb: Comb = {
      doc: combData.id,
      postDoc: combData.data().postDoc,
      ansDoc: combData.data().ansDoc,
      path: combData.data().path,
      thm: combData.data().thm,
      body: combData.data().body,
      ans: combData.data().ans,
    };
    combs.push(comb);
  });

  return combs;
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

export const updateSiBody = actionCreator<{ siBody: string }>('UPDATE_SIBODY');

// async Actions

export const asyncGetMyNicePosts = (uid: string) => {
  return dispatch => {
    const ref = rtdb.ref(uid);
    console.log(ref);
    console.log('value');
    ref.once('value', snap => {
      console.log(snap);
      console.log('called');
      const mynices: Nice[] = [];
      snap.forEach(post => {
        const postDoc = post.key;
        const path = post.val().path;
        const by = post.val().by;
        mynices.push({ postDoc, path, by });
      });
      dispatch(getMyNicePosts(mynices));
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

export const asyncGetMyCombs = (uid: string) => {
  return dispatch => {
    db.collection('combs')
      .where('user', '==', uid)
      .get()
      .then(docs => {
        const myCombs: Comb[] = [];
        docs.forEach(doc => {
          const docId = doc.id;
          const postDoc = doc.data().postDoc;
          const ansDoc = doc.data().ansDoc;
          const path = doc.data().path;
          const thm = doc.data().thm;
          const body = doc.data().body;
          getAns(ansDoc).then(a => {
            const comb: Comb = {
              doc: docId,
              postDoc,
              ansDoc,
              path,
              thm,
              body,
              ans: a,
            };
            myCombs.push(comb);
          });
        });
        dispatch(getMyCombs(myCombs));
      });
  };
};

// export const asyncGetMyPosts = (uid: string) => {
//   return dispatch => {
//     db.collection('posts')
//       .where('user', '==', uid)
//       .get()
//       .then(function(querySnapshot) {
//         const myposts: Post[] = [];
//         querySnapshot.forEach(function(doc) {
//           const thm = doc.data().thm;
//           const ownerId = doc.data().user;
//           const numNice = doc.data().numnice;
//           const createdAt = doc.data().createdAt;
//           storage
//             .ref(doc.data().path)
//             .getDownloadURL()
//             .then(function(url) {
//               myposts.push({
//                 doc: doc.id,
//                 path: url,
//                 thm,
//                 ownerId,
//                 numNice,
//                 createdAt,
//               });
//             })
//             .catch(e => {
//               dispatch(fetchImgError({}));
//             });
//         });

//         return myposts;
//       })
//       .then(myposts => {
//         dispatch(getMyPosts(myposts));
//       });
//   };
// };

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
