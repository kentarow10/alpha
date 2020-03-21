import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import firebase, { db, storage, rtdb } from '../../firebase/firebase';
import post from '../behind/post';

export const deleteComments = async (postDoc: string, ansDoc: string) => {
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const ans = db
    .collection('posts')
    .doc(postDoc)
    .collection('answers')
    .doc(ansDoc);

  const deleteDoc = await ans.collection('comments').get();
  if (deleteDoc === undefined) {
    batchArray[0].commit();

    return;
  } else {
    deleteDoc.forEach(d => {
      batchArray[batchIndex].delete(ans.collection('comments').doc(d.id));
      operationCounter++;

      if (operationCounter === 499) {
        batchArray.push(db.batch());
        batchIndex++;
        operationCounter = 0;
      }
    });

    batchArray.forEach(async batch => await batch.commit());
  }
};

const deletePostInUsers = async (postDoc: string) => {
  const them = await db
    .collectionGroup('nices')
    .where('postDoc', '==', postDoc)
    .get();
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const parentUidList: string[] = [];
  them.forEach(d => {
    parentUidList.push(d.data().parent);
  });
  parentUidList.forEach(uid => {
    batchArray[batchIndex].delete(
      db
        .collection('users')
        .doc(uid)
        .collection('nices')
        .doc(postDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  batchArray.forEach(async batch => await batch.commit());
};

const deleteAnsInUsers = async (ansDoc: string) => {
  const them = await db
    .collectionGroup('gotits')
    .where('ansDoc', '==', ansDoc)
    .get();
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const parentUidList: string[] = [];
  them.forEach(d => {
    parentUidList.push(d.data().parent);
  });
  parentUidList.forEach(uid => {
    batchArray[batchIndex].delete(
      db
        .collection('users')
        .doc(uid)
        .collection('gotits')
        .doc(ansDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });
  batchArray.forEach(async batch => await batch.commit());
};

const deleteRefInLinks = async (ansDoc: string) => {
  const fromSnap = await db
    .collectionGroup('from')
    .where('ansDoc', '==', ansDoc)
    .get();
  const toSnap = await db
    .collectionGroup('to')
    .where('ansDoc', '==', ansDoc)
    .get();

  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const parentAnsDocList: string[] = [];
  fromSnap.forEach(d => {
    parentAnsDocList.push(d.data().parent);
  });
  toSnap.forEach(d => {
    parentAnsDocList.push(d.data().parent);
  });
  const set = new Set(parentAnsDocList);
  set.forEach(prnt => {
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('from')
        .doc(ansDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('to')
        .doc(ansDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
    batchArray[batchIndex].delete(
      db
        .collection('links')
        .doc(prnt)
        .collection('mutual')
        .doc(ansDoc),
    );
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
};

export const deleteAnswer = async (postDoc: string, ansDoc: string) => {
  const ans = db
    .collection('posts')
    .doc(postDoc)
    .collection('answers')
    .doc(ansDoc);
  await deleteRefInLinks(ansDoc);
  await deleteComments(postDoc, ansDoc);
  await ans.delete();
  await rtdb.ref(ansDoc).remove();
};

export const deleteAnswers = async (postDoc: string) => {
  const post = db.collection('posts').doc(postDoc);
  const deleteDoc = await post.collection('answers').get();
  const batchArray: firebase.firestore.WriteBatch[] = [];

  deleteDoc.forEach(async d => {
    await deleteRefInLinks(d.id);
    await deleteComments(postDoc, d.id);

    batchArray.push(db.batch());
    let operationCounter = 0;
    let batchIndex = 0;
    batchArray[batchIndex].delete(post.collection('answers').doc(d.id));
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
};

export const deletePost = async (postDoc: string) => {
  const post = db.collection('posts').doc(postDoc);
  await deleteAnswers(postDoc);
  await post.delete();
  await rtdb.ref(postDoc).remove();
};
