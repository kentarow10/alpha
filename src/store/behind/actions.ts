import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import {
  NavigationContext,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
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

export const detailInit = actionCreator<DetailParams>('DETAIL_INIT');

// Async Actions

// 良いねのリスン

export const asyncListenNice = (postDoc: string) => {
  return dispatch => {
    rtdb.ref(postDoc).on('value', snap => {
      const numNice = snap.val().nicesCount;
      if (snap.val().nices) {
        console.log(snap.val().nices);
        const niceByList = Object.keys(snap.val().nices);
        dispatch(getNice({ numNice, niceByList }));
      } else {
        console.log('snap.val().nices');
        dispatch(getNice({ numNice, niceByList: [] }));
      }
    });
  };
};

// 良いねを押した時

export const asyncNice = (postDoc: string, uid: string) => {
  return dispatch => {
    if (postDoc === undefined) return;
    console.log(postDoc);
    const postRef = rtdb.ref(postDoc);
    console.log(postRef);
    // postRef.set({ nicesCount: 1, nices: {} });

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
