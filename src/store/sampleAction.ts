import { actionCreatorFactory } from 'typescript-fsa';
import { Asset } from 'expo-asset';
import firebase, { db, storage, rtdb } from '../../firebase/firebase';

export const deleteDocs = async (postDoc: string) => {
  const batchArray: firebase.firestore.WriteBatch[] = [];
  batchArray.push(db.batch());
  let operationCounter = 0;
  let batchIndex = 0;
  const post = db.collection('posts').doc(postDoc);

  const deleteDoc = await post.collection('answers').get();
  deleteDoc.forEach(d => {
    batchArray[batchIndex].delete(post.collection('answers').doc(d.id));
    operationCounter++;

    if (operationCounter === 499) {
      batchArray.push(db.batch());
      batchIndex++;
      operationCounter = 0;
    }
  });

  batchArray.forEach(async batch => await batch.commit());
  await post.delete();
};
