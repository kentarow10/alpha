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
  mail: '',
  pass: '',
  uid: '',
  thm1: '',
  thm2: '',
  thm3: '',
  uri: '',
  showURL: '',
  imageName: '',
  ans: '',
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

  const setAns = (v: string) => {
    setPost({ ...postState, ans: v });
  };

  const setShowURL = (v: string) => {
    setPost({ ...postState, showURL: v });
  };

  const emailAuth = (email: string, pass: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(response => {
        const u = response.user.uid;
        setPost({ ...postState, uid: u });
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const selFile = (uri: string, nm: string) => {
    console.log(nm);
    setPost({
      ...postState,
      uri,
      imageName: nm,
    });
  };
  const onChooseImagePress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      const filename = result.uri.split('/');
      console.log(filename);
      selFile(result.uri, filename);
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

    db.collection('posts')
      .add({
        path: `${postState.uid}/${dt}/${imageName}`,
        owner: postState.uid,
        thms: thms,
        createdAt: date,
      })
      .then(() => {
        alert('投稿完了しました!');
      })
      .catch(error => {
        console.error('Error writing document: ', error);
      });
    const ref = storage.ref().child(`${postState.uid}/${dt}/${imageName}`);

    return ref.put(blob);
  };

  async function getFromStorage(path: string) {
    const url = await storage.ref(path).getDownloadURL();

    return url;
  }

  const fetchFirstPost = async () => {
    db.collection('posts')
      .get()
      .then(snap => {
        const gazo = [];
        snap.forEach(doc => {
          const path = doc.data().path;
          console.log(path);
          gazo.push(path);
        });
        getFromStorage(gazo[0]).then(url => setShowURL(url));
      });
  };

  const answer = async () => {
    const date = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('posts')
      .doc('BETA UCHI')
      .collection('answers')
      .add({
        postDoc: 'BETA UCHI',
        uri: postState.showURL,
        body: postState.ans,
        owner: postState.uid,
        createdAt: date,
        orderThm: 1,
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
          }}
          mode="contained"
        >
          写真を選択
        </Button>
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
          onChangeText={post.setPass}
        />
        <Button
          onPress={() => {
            post.uploadImage(post.postState.uri, post.postState.imageName);
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
