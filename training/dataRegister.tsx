import React, { Component, useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View, SafeAreaView, Text, Image } from 'react-native';
import firebase, { db, storage, rtdb } from '../firebase/firebase';

import Animated, { Easing } from 'react-native-reanimated';
import {
  State,
  TapGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import { TextInput, Button } from 'react-native-paper';
import { createContainer } from 'unstated-next';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const initialData = {
  mail: 'test2@test.com',
  pass: 'password',
  thm1: '',
  thm2: '',
  thm3: '',
  uri: '',
  showURL: '',
  width: 0,
  height: 0,
  imageName: '',
  ans: '',
  uid: '',
  postedBy: '',
  ansBy: '',
  postedAt: new Date(),
};

const usePost = (initialState = initialData) => {
  const [postState, setPost] = useState(initialState);

  const setMail = (v: string) => {
    setPost({ ...postState, mail: v });
  };

  const setPass = (v: string) => {
    setPost({ ...postState, pass: v });
  };
  const set1 = (v: string) => {
    setPost({ ...postState, thm1: v });
  };
  const set2 = (v: string) => {
    setPost({ ...postState, thm2: v });
  };
  const set3 = (v: string) => {
    setPost({ ...postState, thm3: v });
  };
  const setuid = (v: string) => {
    setPost({ ...postState, uid: v });
  };
  const setAns = (v: string) => {
    setPost({ ...postState, ans: v });
  };
  const setShowURL = (v: string) => {
    setPost({ ...postState, showURL: v });
  };
  const setPostedBy = (v: string) => {
    setPost({ ...postState, postedBy: v });
  };
  const setPostedAt = (v: Date) => {
    setPost({ ...postState, postedAt: v });
  };
  const setAnsBy = (v: string) => {
    setPost({ ...postState, ansBy: v });
  };
  const setWH = (w: number, h: number) => {
    setPost({ ...postState, width: w, height: h });
  };
  const emailAuth = (email: string, pass: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(response => {
        const u = response.user.uid;

        // setuid(u);
        setPost({ ...postState, mail: '', pass: '', uid: u });
        console.log(postState.uid + ':user id');
      })
      .catch(error => {
        alert(error.message);
      });
  };
  const selFile = (uri: string, nm: string, width: number, height: number) => {
    console.log(nm);
    setPost({
      ...postState,
      uri,
      imageName: nm,
      width,
      height,
    });
  };
  const onChooseImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      const uriList = result.uri.split('/');
      const filename = uriList.pop();
      console.log('aaaaaaa');
      console.log(result);
      //   setWH(result.width, result.height);
      selFile(result.uri, filename, result.width, result.height);
    }
  };
  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const d = new Date();
    const dt = d.toString().substr(4, 20);
    const date = firebase.firestore.FieldValue.serverTimestamp();
    const thms = [];
    if (postState.thm3) {
      thms.push(postState.thm1);
      thms.push(postState.thm2);
      thms.push(postState.thm3);
    } else if (postState.thm2) {
      thms.push(postState.thm1);
      thms.push(postState.thm2);
    } else {
      thms.push(postState.thm1);
    }
    console.log('attempt posting');
    console.log(postState);
    db.collection('posts')
      .add({
        // path: 'test' + dt + imageName,
        path: `${postState.uid}/${dt}/${imageName}`,
        width: postState.width,
        height: postState.height,
        owner: postState.uid,
        thms: thms,
        createdAt: date,
      })
      .then(() => {
        alert('投稿完了しました!');
        alert(postState.uid);
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
    // const ref = storage.ref().child('test' + dt + imageName);
    const ref = storage.ref().child(`${postState.uid}/${dt}/${imageName}`);

    return ref.put(blob);
  };

  async function getFromStorage(path: string) {
    const url = await storage.ref(path).getDownloadURL();

    return url;
  }

  const fetchFirstPost = async () => {
    db.collection('posts')
      .doc('LFQqbHLwj7YsjZM4amKu')
      .get()
      .then(async doc => {
        const path = doc.data().path;
        const postedat = doc.data().createdAt.toDate();
        const url = await getFromStorage(path);
        // setPostedAt(postedat);
        // setPostedBy(doc.data().owner);
        // setWH(doc.data().width, doc.data().height);
        setPost({
          ...postState,
          postedAt: postedat,
          postedBy: doc.data().owner,
          width: doc.data().width,
          height: doc.data().height,
          thm1: doc.data().thms[0],
          thm2: doc.data().thms[1],
          thm3: doc.data().thms[2],
          showURL: url,
        });
      });
  };

  const answer = async () => {
    const date = firebase.firestore.FieldValue.serverTimestamp();
    const thms = [];
    if (postState.thm3) {
      thms.push(postState.thm1);
      thms.push(postState.thm2);
      thms.push(postState.thm3);
    } else if (postState.thm2) {
      thms.push(postState.thm1);
      thms.push(postState.thm2);
    } else {
      thms.push(postState.thm1);
    }
    db.collection('posts')
      .doc('LFQqbHLwj7YsjZM4amKu')
      .collection('answers')
      .add({
        postDoc: 'LFQqbHLwj7YsjZM4amKu',
        uri: postState.showURL,
        width: postState.width,
        height: postState.height,
        thms: thms,
        orderThm: 1,
        body: postState.ans,
        postedBy: postState.postedBy,
        ansBy: postState.uid,
        postedAt: postState.postedAt,
        ansAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert('回答完了');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return {
    postState,
    setMail,
    setPass,
    set1,
    set2,
    set3,
    setuid,
    setAns,
    emailAuth,
    onChooseImagePress,
    uploadImage,
    fetchFirstPost,
    answer,
  };
};

const PostC = createContainer(usePost);

const Register = () => {
  const post = PostC.useContainer();

  useEffect(() => {
    post.fetchFirstPost();
  }, []);

  useEffect(() => {
    console.log(post);
  }, [post]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>認証情報</Text>
        <TextInput
          label="メールアドレス"
          mode="outlined"
          value={post.postState.mail}
          onChangeText={post.setMail}
        />
        <TextInput
          label="パスワード"
          mode="outlined"
          value={post.postState.pass}
          onChangeText={post.setPass}
        />
        <Button
          onPress={() => {
            post.emailAuth(post.postState.mail, post.postState.pass);
          }}
          mode="contained"
        >
          認証
        </Button>
        <Image
          source={{ uri: post.postState.uri }}
          resizeMode="contain"
          style={{ width: 400, height: 150, backgroundColor: 'black' }}
        />
        <Button
          onPress={() => {
            post.onChooseImagePress();
            console.log('state');
            console.log(post.postState);
          }}
          mode="contained"
        >
          写真を選択
        </Button>
        <TextInput
          label="uid"
          mode="outlined"
          value={post.postState.uid}
          onChangeText={post.setuid}
        />
        <TextInput
          label="お題１"
          mode="outlined"
          value={post.postState.thm1}
          onChangeText={post.set1}
        />
        <TextInput
          label="お題２"
          mode="outlined"
          value={post.postState.thm2}
          onChangeText={post.set2}
        />
        <TextInput
          label="お題３"
          mode="outlined"
          value={post.postState.thm3}
          onChangeText={post.set3}
        />
        <Button
          onPress={() => {
            post.uploadImage(post.postState.uri, post.postState.imageName);
          }}
          mode="contained"
        >
          投稿
        </Button>
        <Text>投稿された画像</Text>
        <Image
          source={{ uri: post.postState.showURL }}
          resizeMode="contain"
          style={{ width: 400, height: 150, backgroundColor: 'black' }}
        />
        <Text>回答する</Text>
        <TextInput
          label="お題１への回答"
          mode="outlined"
          value={post.postState.ans}
          onChangeText={post.setAns}
        />
        <Button
          onPress={() => {
            post.answer();
          }}
          mode="contained"
        >
          送信！
        </Button>
        <Text>投稿された画像と回答にコメントする</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Container = () => {
  return (
    <>
      <PostC.Provider>
        <Register />
      </PostC.Provider>
    </>
  );
};

export default Container;
