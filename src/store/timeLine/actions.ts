import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db } from '../../../firebase/firebase';
import { Post, Comment } from '../types';
import { asyncGetName } from '../../helper';

// 準備

const actionCreator = actionCreatorFactory('TIMELINE');

// plain Actions

export const refetch = actionCreator<{}>('RE_FETCH');

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
        snap.forEach(async doc => {
          const uri = doc.data().uri;
          const thms = doc.data().thms;
          const postBy = doc.data().postBy;
          const poster = await asyncGetName(postBy);
          const width = doc.data().width;
          const height = doc.data().height;
          const postAt = doc.data().postAt;
          posts.push({
            postDoc: doc.id,
            uri,
            path: doc.data().path,
            thms,
            poster,
            postBy,
            width,
            height,
            postAt,
          });
          dispatch(getPosts(posts));
        });
      })
      .catch(() => {
        dispatch(fetchError({}));
      });
  };
};
