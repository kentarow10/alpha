import React, { Component, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import firebase, { db, storage, rtdb } from '../firebase/firebase';

import Animated, { Easing } from 'react-native-reanimated';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
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
  imageName: '',
};

const usePost = (initialState = initialData) => {
  const [postState, setPost] = useState(initialState);

  const setMail = (v: string) => {
    setPost({ ...postState, mail: v });
  };

  const setPass = (v: string) => {
    setPost({ ...postState, pass: v });
  };

  const emailAuth = (email: string, pass: string) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then(response => {
        const user = firebase.auth().currentUser;
        let uid: string;
        if (user != null) {
          uid = user.uid;
          setPost({ ...postState, uid });
        }
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const selFile = (uri: string, nm: string) =>
    setPost({
      ...postState,
      uri,
      imageName: nm,
    });
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
    let numthm = 3;
    if (postState.thm2 === '') {
      numthm = 1;
    } else if (postState.thm3 === '') {
      numthm = 2;
    }
    db.collection('posts')
      .add({
        path: `${postState.uid}/${dt}/${imageName}`,
        user: `${postState.uid}`,
        thm1: postState.thm1,
        thm2: postState.thm2,
        thm3: postState.thm3,
        createdAt: date,
        numnice: 0,
        numthm,
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

  return {
    postState,
    setMail,
    setPass,
    emailAuth,
    onChooseImagePress,
    uploadImage,
  };
};

const PostC = createContainer(usePost);

const Register = () => {
  const post = PostC.useContainer();

  return (
    <SafeAreaView style={styles.container}>
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
        →
      </Button>
      <Text>写真を選択</Text>
      <Text>お題１</Text>
      <Text>お題２</Text>
      <Text>お題３</Text>
      <Text>回答する</Text>
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
