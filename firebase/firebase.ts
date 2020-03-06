import * as firebase from 'firebase';
require('firebase/auth');
require('firebase/storage');
require('firebase/firestore');
require('firebase/database');
import My from './config';

const firebaseConfig = {
  apiKey: My.APIKEY,
  authDomain: My.AUTHDOMAIN,
  databaseURL: My.DATABASEURL,
  projectId: My.PROJECTID,
  storageBucket: My.STORAGEBUCKET,
  messagingSenderId: My.MESSAGINGSENDERID,
  appId: My.APPID,
  // measurementId: My.MEASUREMENTID,
};
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
export const db = firebase.firestore();
export const rtdb = firebase.database();
export default firebase;
