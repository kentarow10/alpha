import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Post, Comment } from '../types';

// 準備

const actionCreator = actionCreatorFactory('TIMELINE');

// Helper

async function getFromStorage(path: string) {
  const url = await storage.ref(path).getDownloadURL();

  return url;
}

// plain Actions

export const startFetch = actionCreator<{}>('START_FETCH');

export const endFetch = actionCreator<{}>('END_FETCH');

export const fetchError = actionCreator<{}>('FETCH_ERROR');

export const getPosts = actionCreator<Post[]>('GET_POST');

// async Actions

export const asyncGetName = async (uid: string) => {
  const uJson = await rtdb.ref(uid).once('value');

  return uJson.val().name;
};

export const asyncGetPosts = () => {
  return dispatch => {
    dispatch(startFetch({}));
    db.collection('posts')
      .get()
      .then(snap => {
        const posts: Post[] = [];
        snap.forEach(doc => {
          const thms = doc.data().thms;
          const postBy = doc.data().postBy;
          const width = doc.data().w;
          const height = doc.data().h;
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
              console.log(e);
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
