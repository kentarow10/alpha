import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import { db, storage, rtdb } from '../../../firebase/firebase';
import { Comb, Ans, Post, Comment, Nice, PostedParams } from '../types';

// 準備

const actionCreator = actionCreatorFactory('BEHIND');

// Helper

// plain Actions

export const startFetch = actionCreator<{}>('START_FETCH');

export const getAnss = actionCreator<Ans[]>('GET_ANS');

export const getParams = actionCreator<{
  postDoc: string;
  uri: string;
  owner: string;
  thms: string[];
  createdAt: Date;
}>('GET_PARAMS');

// Async Actions

// 与えられたpostDocからanssを取得する

export const asyncGetAnss = (postDoc: string) => {
  return dispatch => {
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
            ansBy: doc.data().owner,
            ansAt: doc.data().createdAt,
            orderThm: doc.data().orderThm,
          };
          anss.push(ans);
        });
        dispatch(getAnss(anss));
      });
  };
};
