import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { TimeLime } from './timeLine';
import { Comb, Post, Comment, Nice } from '../types';

// 準備

const actionCreator = actionCreatorFactory('TIMELINE');

// Helper

async function getFromStorage(path: string) {
  const url = await storage.ref(path).getDownloadURL();

  return url;
}

// const getAns = async (ansDoc: string) => {
//   const ansData = await db
//     .collection('anss')
//     .doc(ansDoc)
//     .get();
//   const ans: Ans = {
//     doc: ansData.id,
//     postDoc: ansData.data().postDoc,
//     orderThm: ansData.data().orderThm,
//     ownerId: ansData.data().ownerId,
//     fromLinks: ansData.data().fromLinks,
//     toLinks: ansData.data().toLinks,
//     comments: ansData.data().comments,
//   };

//   return ans;
// };

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

export const getPosts = actionCreator<Post[]>('GET_POST');

// async Actions

export const asyncGetPosts = () => {
  return dispatch => {
    dispatch(startFetch({}));
    db.collection('posts')
      .get()
      .then(snap => {
        const posts: Post[] = [];
        snap.forEach(doc => {
          console.log(doc.data());
          const thms = doc.data().thms;
          const owner = doc.data().owner;
          const width = doc.data().width;
          const height = doc.data().height;
          const createdAt = doc.data().createdAt.toDate();
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
          dispatch(getPosts(posts));
        });
      })
      .catch(() => {
        dispatch(fetchError({}));
      });
  };
};
