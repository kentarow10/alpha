import { actionCreatorFactory } from 'typescript-fsa';
import { Me } from './me';
import { Post } from '../types';

const actionCreator = actionCreatorFactory('TODO');

export const EditSi = actionCreator<{ siBody: string }>('EDIT_SI');

const getMyPosts = actionCreator<{posts: Post[]}>('GET_MY_POST')
export const asyncGetMyPosts = (uid: string) => {
    return (dispatch) => {
        return db.collection("posts")
        .where("user", "==", uid).get().then(function(querySnapshot) {
            let myposts: Post[] = []
          querySnapshot.forEach(function(doc) {
            const id = doc.id
            const numnice = doc.data().numnice
            const numthm = doc.data().numthm
            const thm1 = doc.data().thm1
            const thm2 = doc.data().thm2
            const thm3 = doc.data().thm3
            storage.ref(doc.data().path).getDownloadURL().then(function(url) {
                newdatas.push({
                    id: id,
                    numnice: numnice,
                    numthm: numthm,
                    thm1: thm1,
                    thm2: thm2,
                    thm3: thm3,
                    path: url,
                    })
            })
            .catch(function(error) {
              switch (error.code) {
                case 'storage/object-not-found':
                  alert('storage/object-not-found')
                  break;
                case 'storage/unauthorized':
                  alert('storage/unauthorized')
                  break;
                case 'storage/canceled':
                  alert('storage/canceled')
                  break;
                case 'storage/unknown':
                  alert('storage/unknown')
                  break;
              }
            })
    }
}
    }}

const simpleLogin = user => ({ type: LOGIN, user });

const fetchSomeThing = (url) => {
    return (dispatch) => {
      // リクエスト開始のActionをdispatch
      dispatch(requestData(url));

      return fetch(url)
        .then(res => {
          if (!res.ok) {
            return Promise.resolve(new Error(res.statusText));
          }
          return res.json();
        })
        .then(json => {
          // レスポンスの受け取り（リクエスト成功）のActionをdispatch
          dispatch(receiveData(json))
        })
        .catch(error => {
          // リクエスト失敗のActionをdispatch
          dispatch(failReceiveData(error));
        });
    }
  };
